class InitGameModel extends Model
{
    /**
     * @override
     */
    setupCallback()
    {
        this.model.warehouse = new Storage("Warehouse", this.model.config.warehouseCapacity);
        this.model.factory = new Factory("Factory", this.model.products);

        for (var i = 0; i < this.model.config.warehouseContainers; i++) {
            this.model.warehouse.addItem(
                new Container("Shelf", this.model.config.containerCapacity)
            );
        }

        this.toObject();
    }

    /**
     * @override
     */
    toObject()
    {
        super.toObject();
        this._modelExists();
    }

    _modelExists()
    {
        // set-up game; TODO should this be here?
        var controller = new InitGameController();
        controller.view();
    }
}
