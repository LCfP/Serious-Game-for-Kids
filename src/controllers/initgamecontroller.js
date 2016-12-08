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
        ].forEach(
            function (controller) {
                controller.view();
            }
        );

        $.when(
            this._setTopbar(),
            this._loadSidebarLeft(),
            this._loadSidebarRight()
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
    _loadSidebarLeft()
    {
        return this._loadTemplate(
            "src/views/template/sidebar-left.html",
            "#sidebar-left",
            GAME.model.config
        );
    }

    /**
     * @private
     */
    _loadSidebarRight()
    {
        return this._loadTemplate(
            "src/views/template/sidebar-right.html",
            "#sidebar-right",
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
        $("#sidebar-left-toggle").click(function (e) {
            e.stopPropagation();

            $("#sidebar-left").width(250);
            $(".wrapper").css({opacity: .3});
        });

        // find way to merge these two events
        $("#sidebar-right-toggle").click(function (e) {
            e.stopPropagation();

            $("#sidebar-right").width(250);
            $(".wrapper").css({opacity: .3});
        });

        $(".wrapper").click(function () {
            let elem = $(".sidebar");

            elem.width(0);
            $(this).css({opacity: 1});
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


