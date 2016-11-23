class SimulationController extends Controller
{
    /**
     * Called by InitGameController once the views have been loaded and the game is ready.
     */
    run()
    {
        this._setup();

        // TODO dynamic time steps, taking execution time into account,
        // see http://stackoverflow.com/q/1280263/4316405
        this.running = setInterval(
            $.proxy(this._run, this),
            1000 / MODEL.config.hour
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

            MODEL.config.isPaused = true;

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
        if (MODEL.config.isPaused) {
            clearInterval(this.running);
        }

        MODEL.config.hours++;

        this._runHour();
        if (MODEL.config.hours % 24 == 0) {
            this._runDay();
        }
    }

    /**
     * @private
     */
    _runHour()
    {
        // TODO

        $(".timer-hours").html(MODEL.config.hours % 24);
    }

    /**
     * @private
     */
    _runDay()
    {
        // TODO

        $(".timer-days").html(MODEL.config.hours / 24);
    }

    /**
     * @private
     */
    _setup()
    {
        if (!MODEL.config.hasOwnProperty("hours")) {
            MODEL.config.hours = 0;
        }

        MODEL.config.isPaused = false;
    }
}