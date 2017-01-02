"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FactoryController = function (_OrderController) {
    _inherits(FactoryController, _OrderController);

    function FactoryController() {
        _classCallCheck(this, FactoryController);

        return _possibleConstructorReturn(this, (FactoryController.__proto__ || Object.getPrototypeOf(FactoryController)).apply(this, arguments));
    }

    _createClass(FactoryController, [{
        key: "view",
        value: function view() {
            var _this2 = this;

            this._loadTemplate("src/views/template/factory/factory.html", "#factory", GAME.model.factory).done(function () {
                _this2.registerEvent();

                $("#order-transport-cost").html(GAME.model.config.orderTransportCost);
            });
        }

        /**
         * @augments Controller.registerEvent
         */

    }, {
        key: "registerEvent",
        value: function registerEvent() {
            // form submission, creates an order
            $("form[name=newFactoryOrder]").submit(function (e) {
                e.preventDefault();

                var controller = new FactoryController();
                if (controller.factoryOrder($(this).serializeArray())) {
                    // after succesful order, reset form to default state.
                    $(this).trigger("reset");
                    $("form[name=newFactoryOrder] :input").trigger("change");
                }
            });

            // updates the information for the current order process
            $("form[name=newFactoryOrder] :input").change(function (e) {
                var formValues = $("form[name=newFactoryOrder]").serializeArray();
                var products = OrderController._makeOrder(formValues);

                $("#factory-order-cost").html(products.reduce(function (sum, prod) {
                    return sum + prod.stockValue();
                }, 0));
                $("#factory-order-capacity").html(products.reduce(function (sum, prod) {
                    return sum + prod.shelfSize();
                }, 0));
            });
        }

        /**
         * Handles ordering a set of products from the factory
         *
         * @param {Array} formValues - The ordered products, as an array of {name, quantity} objects.
         */

    }, {
        key: "factoryOrder",
        value: function factoryOrder(formValues) {
            var products = OrderController._makeOrder(formValues);
            var order = new FactoryOrder(products);

            if (this.validateOrder(order)) {
                GAME.model.orders.push(order);

                this._updateMoney(-order.orderCost() - GAME.model.config.orderTransportCost);
                this._updateOrderView(order);

                toastr.success(Controller.l("Order has been placed!"));

                return true;
            }

            return false;
        }
    }, {
        key: "validateOrder",
        value: function validateOrder(order) {
            var products = order.products;
            var orderSize = products.reduce(function (sum, prod) {
                return sum + prod.shelfSize();
            }, 0);
            var orderCost = products.reduce(function (sum, prod) {
                return sum + prod.stockValue();
            }, 0) + GAME.model.config.orderTransportCost;

            if (!products.length) {
                toastr.warning(Controller.l("An order cannot be empty."));
                return false;
            }

            if (GAME.model.orders.length == GAME.model.config.maxSimultaneousOrders) {
                toastr.error(Controller.l("There is no room for another order at this time!"));
                return false;
            }

            if (orderSize > GAME.model.config.orderCapacity) {
                toastr.error(Controller.l("There is insufficient space on the truck!"));
                return false;
            }

            if (orderCost > GAME.model.config.money) {
                toastr.error(Controller.l("You cannot afford this!"));
                return false;
            }

            if (products.some(function (product) {
                return product.values.quantity < 0;
            })) {
                toastr.error(Controller.l("You cannot order a negative amount!"));
                return false;
            }

            // TODO check warehouse capacity

            return true;
        }

        /**
         * Updates order counter, at every daily interval. When 0, adds to Warehouse.
         */

    }, {
        key: "completeOrder",


        /**
         * @augments OrderController.completeOrder
         */
        value: function completeOrder(order) {
            var warehouseController = new WarehouseController();
            var orderCopy = new FactoryOrder(OrderController._copyOrder(order));

            // process order..
            if (warehouseController.orderUpdateWarehouse(order)) {
                _get(FactoryController.prototype.__proto__ || Object.getPrototypeOf(FactoryController.prototype), "completeOrder", this).call(this, orderCopy);
            }

            // ..and update views
            warehouseController.updateContainerView();
            warehouseController.updateCapacityView();
        }

        /**
         * @private
         */

    }, {
        key: "_updateOrderView",
        value: function _updateOrderView(order) {
            this._loadTemplate("src/views/template/factory/factoryorder.html", "#factory-orders", order, true);
        }
    }], [{
        key: "updateOrder",
        value: function updateOrder() {
            var $handle = $(".factory-order");

            if (!$handle) {
                return;
            }

            $handle.each(function () {
                var _this3 = this;

                var order = GAME.model.orders.filter(function (order) {
                    return order.id === parseInt($(_this3).data('factory'));
                }).shift();
                order.time = order.time - 1;

                if (order.time) {
                    var percentage = 100 * (1 - order.time / order.initDuration);
                    $(this).find('.order-progress-bar').css({ width: percentage + "%" }).attr("aria-valuenow", percentage);
                } else {
                    new FactoryController().completeOrder(order);
                    $(this).remove();
                }
            });

            GAME.model.orders = GAME.model.orders.filter(function (order) {
                return order.time;
            });
        }
    }]);

    return FactoryController;
}(OrderController);