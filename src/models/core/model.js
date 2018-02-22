import Cookies from 'js-cookie';
import toastr from 'toastr';


/**
 * Maintains a `model` field, that represents the current game state.
 */
export default class Model
{
    constructor()
    {
        this.model = {};

        this.model.base = {};

        // factory orders
        this.model.orders = [];

        // current customers
        this.model.customers = [];

        this._load();
    }

    /**
     * Callback for the initial configuration set-up
     *
     * @abstract
     */
    setupCallback()
    {
        throw new Error("Not implemented by parent class");
    }

    /**
     * Turns this Model into the global GAME.model
     */
    toObject()
    {
        GAME.model = this.model;
    }

    /**
     * Loads the model from the server-side files.
     *
     * @private
     */
    _load()
    {
        // async AJAX calls to get these JSON files
        // order for $.when: data, textStatus, jqXHR
        $.when(
            ...["config", "products", "levels", "customers", "trips"]
                .map(loc => $.getJSON("src/assets/" + loc + ".json"))
        ).done(
            (config, products, levels, customers, trips) => {
                this.model.config = config[0];
                this.model.levels = levels[0];
                this.model.trips = trips[0];

                this.model.base.products = products[0];
                this.model.base.customers = customers[0];

                // toastr settings, from the config
                this.model.message = toastr;
                this.model.message.options = this.model.config.toastr;

                $.when(this._getLang()).done(
                    (lang) => {
                        this.model.lang = lang;

                        try {
                            this.setupCallback();
                        } catch (e) {
                            // most likely due to an unimplemented callback.
                        }
                    }
                );

            }
        );
    }

    /**
     * Retrieves the language file from the cookie settings. If none found, defaults to "en".
     *
     * @private
     */
    _getLang()
    {
        const langIso = (Cookies.get("lang") || "nl").toLowerCase();

        // only if we support this language ISO
        if (this.model.config.languages.map(lang => lang.iso).includes(langIso)) {
            this.model.config.language = langIso;
            this.model.config.languages = this.model.config.languages.map(
                (lang) => {
                    lang.active = lang.iso == langIso;
                    return lang;
                }
            );

            return langIso == "en" ? {} : $.getJSON("src/assets/language/" + langIso + ".json");
        }
    }
}
