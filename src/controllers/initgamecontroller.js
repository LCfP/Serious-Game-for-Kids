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

                const sim = new SimulationController();
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
            "src/views/template/sidebar/sidebar-left.html",
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
            "src/views/template/sidebar/sidebar-right.html",
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
        // Handles the tours
        GAME.model.trips.handlers.forEach(
            handler => this._tripEventHelper(handler)
        );

        // initial tour (intro)
        $(document).ready(function () {
            if (!Cookies.get('hasVisited')) {
                const helpController = new HelpController();

                helpController.makeTrip("StatusBar", {intro: true});
                Cookies.set('hasVisited', true, {expires: 7});
            }
        });

        // left menu opening
        $("#sidebar-left-toggle").click(function (e) {
            sidebar_handler(e, "#sidebar-left");
        });

        // right menu (history) opening
        $("#sidebar-right-toggle").click(function (e) {
            sidebar_handler(e, "#sidebar-right", 450);
        });

        // closing menu / history
        $(".wrapper").click(function () {
            $(".sidebar").width(0);
            $(this).css({opacity: 1});
        });

        // listens for changes in the language setting.
        $("#language").change(function () {
            $("#language option:selected").each(
                () => {
                    let lang = $(this).val();
                    Cookies.set("lang", lang, {expires: 7});

                    toastr.success(
                        Controller.l("Language has been updated! Make sure you refresh the page for changes to take effect.")
                    );
                }
            )
        });

        const sidebar_handler = function (e, anchor, width=250, css={opacity: .3}) {
            e.stopPropagation();

            $(anchor).width(width);
            $(".wrapper").css(css);
        };
    }

    /**
     * @private
     */
    _tripEventHelper(handler)
    {
        const helpController = new HelpController();

        $(handler.anchor).click(function () {
            helpController.makeTrip(
                handler.tour,
                handler.hasOwnProperty("props") ? handler.props : {}
            );
        });
    }
}
