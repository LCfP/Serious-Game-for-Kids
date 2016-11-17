class InitGameController extends Controller
{
    /**
     * Displays the initial game state
     *
     * @override
     */
    view()
    {
        var warehouseController = new WarehouseController();
        warehouseController.view();

        var factoryController = new FactoryController();
        factoryController.view();

        var customerController = new CustomerController();
        customerController.view();

        this._setTopbar();
    }

    /**
     * @private
     */
    _setTopbar()
    {
        $.get(
            "src/views/template/topbar.html",
            function (topbarView) {
                var template = Mustache.render(topbarView, MODEL.config);
                $("#top-bar").append(template);
            }
        )
    }
}
