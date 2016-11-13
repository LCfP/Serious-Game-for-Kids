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

            // game configuration
            this.model.config = this._config();

            // houses the available products for order
            this.model.products = this._products();

            // stores the current incoming orders from the factory, at most config.maxSimultaneousOrders
            this.model.orders = {};
        }
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
    _config()
    {
        return {
            maxSimultaneousOrders: 2,
            warehouseCapacity: 6,
            containerCapacity: 250,
            orderCapacity: 1000,
            orderTransportDuration: 7,

            warehouseContainers: 4,
            money: 10000
        };
    }

    /**
     * @private
     */
    _products()
    {
        return [
            {
                name: "Banana",
                unitPrice: 1.0,
                isPerishable: true,
                perishable: 15,
            },
            {
                name: "Apple",
                unitPrice: 1.0,
                isPerishable: true,
                perishable: 20
            },
            {
                name: "T-shirt",
                unitPrice: 5.0,
                isPerishable: false,
                perishable: 0
            }
        ];
    }
}
