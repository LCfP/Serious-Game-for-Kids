"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InitGameController = function (_Controller) {
    _inherits(InitGameController, _Controller);

    function InitGameController() {
        _classCallCheck(this, InitGameController);

        return _possibleConstructorReturn(this, (InitGameController.__proto__ || Object.getPrototypeOf(InitGameController)).apply(this, arguments));
    }

    _createClass(InitGameController, [{
        key: "view",

        /**
         * Displays the initial game state
         *
         * @override
         */
        value: function view() {
            var _this2 = this;

            [new WarehouseController(), new FactoryController(), new CustomerController()].forEach(function (controller) {
                controller.view();
            });

            $.when(this._setTopbar(), this._loadSidebarLeft(), this._loadSidebarRight()).done(function () {
                _this2.registerEvent();

                var sim = new SimulationController();
                sim.registerEvent();
            });
        }

        /**
         * @private
         */

    }, {
        key: "_loadSidebarLeft",
        value: function _loadSidebarLeft() {
            return this._loadTemplate("src/views/template/sidebar/sidebar-left.html", "#sidebar-left", GAME.model.config);
        }

        /**
         * @private
         */

    }, {
        key: "_loadSidebarRight",
        value: function _loadSidebarRight() {
            return this._loadTemplate("src/views/template/sidebar/sidebar-right.html", "#sidebar-right", GAME.model.config);
        }

        /**
         * @private
         */

    }, {
        key: "_setTopbar",
        value: function _setTopbar() {
            return this._loadTemplate("src/views/template/topbar.html", "#top-bar", GAME.model.config, true);
        }
    }, {
        key: "registerEvent",
        value: function registerEvent() {
            var sidebar_handler = function sidebar_handler(e, anchor) {
                var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 250;
                var css = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { opacity: .3 };

                e.stopPropagation();

                $(anchor).width(width);
                $(".wrapper").css(css);
            };

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
                $(this).css({ opacity: 1 });
            });

            // listens for changes in the language setting.
            $("#language").change(function () {
                var _this3 = this;

                $("#language option:selected").each(function () {
                    var lang = $(_this3).val();
                    Cookies.set("lang", lang, { expires: 7 });

                    toastr.success(Controller.l("Language has been updated! Make sure you refresh the page for changes to take effect."));
                });
            });
        }
    }]);

    return InitGameController;
}(Controller);