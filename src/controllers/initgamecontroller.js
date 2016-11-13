class InitGameController extends Controller
{
    /**
     * Displays the initial game state
     *
     * @override
     */
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
        $.get(
            "src/views/template/warehouse.html",
            function (warehouseView)
            {
                var template = Mustache.render(warehouseView, MODEL.warehouse);
                $("#warehouse").html(template);
            }
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
        )
    }
}
