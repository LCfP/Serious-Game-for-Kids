class SimulationController extends Controller
{
    /**
     * Called by InitGameController once the views have been loaded and the game is ready.
     */
    run()
    {
        this._setup();

        this.running = setInterval(
            $.proxy(this._run, this),
            1000 / GAME.model.config.hour
        );
    }

    /**
     * @augments Controller.registerEvent
     */
    registerEvent()
    {
        $(".timer").click(function () {
            $(".timer").each((i, elem) => $(elem).removeClass("active"));

            var elem = $(this).children(":first");
            var sim = new SimulationController();

            GAME.model.config.isPaused = true;

            if (elem.hasClass("glyphicon-play")) {
                sim.run();
            }

            $(this).addClass("active");
        });
    }

    /**
     * @private
     */
    _run()
    {
        if (GAME.model.config.isPaused) {
            clearInterval(this.running);
        }

        GAME.model.config.hours++;

        this._runHour();
        if (GAME.model.config.hours % 24 == 0) {
            this._runDay();
        }
    }

    /**
     * @private
     */
    _runHour()
    {
        const demandGenerator = new DemandController();

        demandGenerator.doCustomerOrderGeneration();
        FactoryController.updateOrder();

        $(".timer-hours").html(GAME.model.config.hours % 24);
    }

    /**
     * @private
     */
    _runDay()
    {
        let warehouseController = new WarehouseController();

        warehouseController.updateHoldingCost();
        warehouseController.updatePerishableProducts();

        warehouseController.updateContainerView();
        warehouseController.updateCapacityView();

        $(".timer-days").html(GAME.model.config.hours / 24);
    }

    /**
     * @private
     */
    _setup()
    {
        if (!GAME.model.config.hasOwnProperty("hours")) {
            GAME.model.config.hours = 0;
        }

        GAME.model.config.isPaused = false;
    }
}
