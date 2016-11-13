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

            this.model.config = {
                maxSimultaneousOrders: 2,
                warehouseCapacity: 6,
                containerCapacity: 250,
                orderCapacity: 1000,
                orderTransportDuration: 7,

                initWarehouseContainers: 4
            };
        }
    }

    /**
     * Turns this Model into the new global MODEL.
     */
    toObject()
    {
        window.MODEL = this.model;
    }
}
