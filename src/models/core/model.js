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

            // async AJAX calls to get these JSON files
            // order for $.when: data, textStatus, jqXHR
            $.when(
                this._configHelper(),
                this._productsHelper()
            ).done(
                (config, products) => {
                    // game configuration
                    this.model.config = config[0];

                    // product types
                    this.model.products = products[0];

                    try {
                        this.setupCallback();
                    } catch (e) {
                        // most likely due to an unimplemented callback.
                    }
                });

            // stores the current incoming orders from the factory
            this.model.orders = [];
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
     * @private
     */
    _configHelper()
    {
        return $.ajax({
            url: "src/assets/config.json",
            dataType: "JSON"
        });
    }

    /**
     * @private
     */
    _productsHelper()
    {
        return $.ajax({
            url: "src/assets/products.json",
            dataType: "JSON"
        });
    }
}
