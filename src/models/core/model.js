/**
 * Maintains a `model` field, that represents the current game state.
 */
class Model
{
    constructor()
    {
        if (typeof MODEL !== 'undefined' && MODEL in window) {
            this.model = MODEL;
        } else {
            this.model = {};

            // factory orders
            this.model.orders = [];

            // current customers
            this.model.customers = [];

            this._load();
        }
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
     * Turns this Model into the new global MODEL.
     */
    toObject()
    {
        window.MODEL = this.model;
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
            $.getJSON("src/assets/products.json")
        ).done(
            (config, products) => {
                this.model.config = config[0];
                this.model.products = products[0];

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
            return $.getJSON("src/assets/language/" + langIso + ".json");
        } else {
            // default EN
            this.model.config.language = "en";
            return {};
        }
    }
}
