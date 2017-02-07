class InitGameModel extends Model
{
    /**
     * @override
     */
    setupCallback()
    {
        var availableProducts = this.model.base.products.filter(product => {
            return product.available;
        });

        this.model.warehouse = new Storage("Warehouse", this.model.config.warehouseCapacity);
        this.model.factory = new Factory("Factory", availableProducts);

        for (let i = 0; i < this.model.config.warehouseContainers; i++) {
            this.model.warehouse.addItem(
                new Container("Rack", this.model.config.containerCapacity)
            );
        }

        this.toObject();

        // callback for when the MODEL exists in the window
        initGame();
    }
}
