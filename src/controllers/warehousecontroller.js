class WarehouseController extends Controller
{
    view()
    {
        this._warehouseHelper();
        this._containerHelper();
    }

    /**
     * Helper method to display the warehouse
     *
     * @private
     */
    _warehouseHelper()
    {
        this._loadTemplate(
            "src/views/template/warehouse.html",
            "#warehouse",
            MODEL.warehouse
        );
    }

    /**
     * Helper method to fill the warehouse view with containers.
     *
     * @private
     */
    _containerHelper()
    {
        MODEL.warehouse.items.forEach(
            (container) => {
                super._loadTemplate(
                    "src/views/template/container.html",
                    "#containers",
                    container,
                    true
                );
            }
        );
    }

    /**
     * Helper method to refresh the containers.
     *
     * @private
     */
    _updateContainers()
    {
        $("#containers").empty();
        this._containerHelper();
    }
}
