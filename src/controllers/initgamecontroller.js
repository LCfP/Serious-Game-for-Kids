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
    }
}
