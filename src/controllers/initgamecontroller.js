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
        this._loadTemplate(
            "src/views/template/topbar.html",
            "#top-bar",
            MODEL.config,
            true
        );
    }
}
