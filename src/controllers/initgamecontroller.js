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
        ).done(() => this.registerEvent());
    }

    registerEvent()
    {
        // listens for changes in the language setting.
        $("#language").change(function () {
            $("#language option:selected").each(
                () => {
                    var lang = $(this).val();
                    Cookies.set("lang", lang, {expires: 7});

                    toastr.success(
                        Controller.l("Language has been updated! Make sure you refresh the page for changes to take effect.")
                    );
                }
            )
        })
    }
}
