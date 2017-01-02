"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SimulationController = function (_Controller) {
    _inherits(SimulationController, _Controller);

    function SimulationController() {
        _classCallCheck(this, SimulationController);

        return _possibleConstructorReturn(this, (SimulationController.__proto__ || Object.getPrototypeOf(SimulationController)).apply(this, arguments));
    }

    _createClass(SimulationController, [{
        key: "run",

        /**
         * Called by InitGameController once the views have been loaded and the game is ready.
         */
        value: function run() {
            this._setup();

            this.running = setInterval($.proxy(this._run, this), 1000 / GAME.model.config.hour);
        }

        /**
         * @augments Controller.registerEvent
         */

    }, {
        key: "registerEvent",
        value: function registerEvent() {
            $(".timer").click(function () {
                $(".timer").each(function (i, elem) {
                    return $(elem).removeClass("active");
                });

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

    }, {
        key: "_run",
        value: function _run() {
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

    }, {
        key: "_runHour",
        value: function _runHour() {
            // TODO every day, and every once in a while (structural and variable?). We need to think about this.
            // Random component - About 1 per day = ~1.72, 2 per day = ~1.38.
            if (OrderController.normalDistribution() > 1.72 || GAME.model.config.hours % 24 == 8) {
                var customerController = new CustomerController();
                customerController.generateOrder();
            }

            FactoryController.updateOrder();

            $(".timer-hours").html(GAME.model.config.hours % 24);
        }

        /**
         * @private
         */

    }, {
        key: "_runDay",
        value: function _runDay() {
            var warehouseController = new WarehouseController();

            warehouseController.updateHoldingCost();
            warehouseController.updatePerishableProducts();

            warehouseController.updateContainerView();
            warehouseController.updateCapacityView();

            $(".timer-days").html(GAME.model.config.hours / 24);
        }

        /**
         * @private
         */

    }, {
        key: "_setup",
        value: function _setup() {
            if (!GAME.model.config.hasOwnProperty("hours")) {
                GAME.model.config.hours = 0;
            }

            GAME.model.config.isPaused = false;
        }
    }]);

    return SimulationController;
}(Controller);