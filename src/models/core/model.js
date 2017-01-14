/**
 * Maintains a `model` field, that represents the current game state.
 */
class Model
{
    constructor()
    {
        this.model = {};

        // factory orders
        this.model.orders = [];

        // current customers
        this.model.customers = [];

        // events happened in the past
        this.model.history = [];

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
            $.getJSON("src/assets/config.json"),
            $.getJSON("src/assets/products.json"),
            $.getJSON("src/assets/levels.json")
        ).done(
            (config, products, levels) => {
                this.model.config = config[0];
                this.model.products = products[0];
                this.model.levels = levels[0];

                // toastr settings, from the config
                toastr.options = this.model.config.toastr;

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
        var langIso = (Cookies.get("lang") || "").toLowerCase();

        // only if we support this language ISO
        if (langIso != "en" && this.model.config.languages.map(lang => lang.iso).includes(langIso)) {
            this.model.config.language = langIso;
            this.model.config.languages = this.model.config.languages.map(
                (lang) => {
                    lang.active = lang.iso == langIso;
                    return lang;
                }
            );

            return $.getJSON("src/assets/language/" + langIso + ".json");
        } else {
            // default EN
            this.model.config.language = "en";
            return {};
        }
    }
}
