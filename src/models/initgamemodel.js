class InitGameModel extends Model
{
    /**
     * Adds the `warehouse` field to the model.
     */
    setupModel()
    {
        this.model.warehouse = new Storage("Warehouse", this.model.config.warehouseCapacity);

        for (var i = 0; i < this.model.config.initWarehouseContainers; i++) {
            this.model.warehouse.addItem(
                new Container("Shelf", this.model.config.containerCapacity)
            );
        }
    }
}
