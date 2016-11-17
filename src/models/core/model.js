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
            (config, products, lang) => {
                this.model.config = config[0];
                this.model.products = products[0];

                try {
                    this.setupCallback();
                } catch (e) {
                    // most likely due to an unimplemented callback.
                }
            }
        );
    }
}
