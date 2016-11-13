class InitGameModel extends Model
{
    /**
     * @override
     */
    setupCallback()
    {
        this.model.warehouse = new Storage("Warehouse", this.model.config.warehouseCapacity);
        this.model.factory = new Factory("Factory", this.model.products);

        console.log(this.model.config);
        for (var i = 0; i < this.model.config.warehouseContainers; i++) {
            this.model.warehouse.addItem(
                new Container("Shelf", this.model.config.containerCapacity)
            );
        }

        this.toObject();
    }
}
