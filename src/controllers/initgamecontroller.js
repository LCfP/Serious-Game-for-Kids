import Controller from './core/controller';

import WarehouseController from './warehousecontroller';
import FactoryController from './factorycontroller';
import CustomerController from './customercontroller';
import SimulationController from './simulationcontroller';
import HelpController from './helpcontroller';
import ScoreboardController from './scoreboardcontroller';
import ScoreController from './scorecontroller'

import Cookies from 'js-cookie';


export default class InitGameController extends Controller
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
            new ScoreboardController(),
        ].forEach(
            function (controller) {
                controller.view();
            }
        );

        $.when(
            this._setTopbar(),
            this._loadSidebarLeft(),
        ).done(
            () => {
                this.registerEvent();

                const sim = new SimulationController();
                sim.registerEvent();
            }
        );

        // small screen check, if below 1366x768 display message
        if (window.innerWidth < 1366) {
            GAME.model.message.warning(
                Controller.l("This game may not work as desired on small screens. Consider playing on a bigger screen instead!"),
                "",
                {
                    closeButton: true,
                    timeOut: 0
                }
            );
        }

        (new ScoreController()).updateScore();
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
    _setTopbar()
    {
        return this._loadTemplate(
            "src/views/template/topbar.html",
            "#top-bar",
            {
                config: GAME.model.config,
                level: 1
            },
            true
        );
    }

    registerEvent()
    {
        // Handles the tours
        GAME.model.trips.handlers.forEach(
            handler => this._tripEventHelper(handler)
        );

        // left menu opening
        $("#sidebar-left-toggle").click(function (e) {
            sidebar_handler(e, "#sidebar-left");
        });

        // closing menu
        $(".wrapper").click(function () {
            $(".sidebar").width(0);
            $(this).css({opacity: 1});
        });

        // listens for changes in the language setting.
        $("#language").change(function () {
            $("#language option:selected").each(
                () => {
                    const lang = $(this).val();
                    Cookies.set("lang", lang, {expires: 7});

                    GAME.model.message.success(
                        Controller.l("Language has been updated! Make sure you refresh the page for changes to take effect.")
                    );
                }
            )
        });

        // join room 
        $("#open-create-team-modal").click((e) => {
            $('#create-team-modal').modal('show');
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
