class InitGameController extends Controller
{
    /**
     * Displays the initial game state
     *
     * @override
     */
    view()
    {
        [
            new WarehouseController(),
            new FactoryController(),
            new CustomerController(),
            new HistoryController()
        ].forEach(
            function (controller) {
                controller.view();
            }
        );

        $.when(
            this._setTopbar(),
            this._loadMenu()
        ).done(
            () => {
                this.registerEvent();

                var sim = new SimulationController();
                sim.registerEvent();
            }
        );
    }

    /**
     * @private
     */
    _loadMenu()
    {
        return this._loadTemplate(
            "src/views/template/menu.html",
            "#overlay-menu",
            GAME.model.config
        );
    }

    /**
     * @private
     */
    _setTopbar()
    {
        return this._loadTemplate(
            "src/views/template/topbar.html",
            "#top-bar",
            GAME.model.config,
            true
        );
    }

    registerEvent()
    {
        // toggles open/close menu
        $("#menu-toggle").click(function (e) {
            e.stopPropagation();

            $("#overlay-menu").width(250);
            $(".wrapper").css({marginLeft: 250, opacity: .3});
        });

        $(".wrapper").click(function () {
            let elem = $("#overlay-menu");

            if (elem.width()) {
                elem.width(0);
                $(this).css({marginLeft: 0, opacity: 1.});
            }
        });

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


