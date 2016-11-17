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
        $.get(
            "src/views/template/container.html",
            function (containerView)
            {
                var containers = MODEL.warehouse.items;

                containers.forEach(function (container) {
                    var template = Mustache.render(containerView, container);
                    $("#containers").append(template);
                });
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
