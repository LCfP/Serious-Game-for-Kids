class InitGameController extends Controller {
    /**
     * @override
     */
    view()
    {
        this._warehouseHelper();
        this._containerHelper();
    }

    /**
     * Helper method to fill the warehouse with containers.
     *
     * @private
     */
    _warehouseHelper()
    {
        $.get(
            "src/views/template/warehouse.html",
            function (warehouseView)
            {
                $("#warehouse").html(warehouseView);
            }
        );
    }

    /**
     * Helper method to fill the warehouse with containers.
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
                    $("#containers").append(containerView);
                });
            }
        )
    }
}
