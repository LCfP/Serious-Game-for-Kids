"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CustomerController = function (_OrderController) {
    _inherits(CustomerController, _OrderController);

    function CustomerController() {
        _classCallCheck(this, CustomerController);

        return _possibleConstructorReturn(this, (CustomerController.__proto__ || Object.getPrototypeOf(CustomerController)).apply(this, arguments));
    }

    _createClass(CustomerController, [{
        key: "view",
        value: function view() {
            this._loadTemplate("src/views/template/customer/customer.html", "#customers", GAME.model.customers);
        }
    }, {
        key: "registerEvent",
        value: function registerEvent(id) {
            var closure = function closure(func) {
                var customer = GAME.model.customers.filter(function (customer) {
                    return customer.id == id;
                }).shift();
                var customerController = new CustomerController();

                func(customer, customerController);
                customerController._updateCustomerView();
            };

            $("button[data-customer=" + id + "].customer-serve").click(function (e) {
                closure(function (customer, controller) {
                    if (controller.validateOrder(customer.order)) {
                        controller.completeOrder(customer);
                    } else {
                        toastr.warning(Controller.l("You don't have all the products to complete this order."));
                    }
                });

                $(this).off(e);
            });

            $("button[data-customer=" + id + "].customer-send-away").click(function (e) {
                closure(function (customer, controller) {
                    controller.sendAway(customer);
                });

                $(this).off(e);
            });
        }
    }, {
        key: "generateOrder",
        value: function generateOrder() {
            var _this2 = this;

            var protoOrder = GAME.model.products.map(function (prod) {
                return {
                    name: prod.name,
                    value: _get(CustomerController.prototype.__proto__ || Object.getPrototypeOf(CustomerController.prototype), "randomDemandGenerator", _this2).call(_this2, prod.demand.mean, prod.demand.variance)
                };
            });

            var products = OrderController._makeOrder(protoOrder);

            if (products.length) {
                var customer = new Customer(products);
                GAME.model.customers.push(customer);

                this._updateOrderView(customer);
                toastr.info(Controller.l("New customer is waiting!"));
            }
        }

        /**
         * @augments OrderController.completeOrder
         */

    }, {
        key: "completeOrder",
        value: function completeOrder(customer) {
            this._updateMoney(customer.order.orderCost());

            var warehouseController = new WarehouseController();
            var orderCopy = new CustomerOrder(OrderController._copyOrder(customer.order));

            if (warehouseController.orderUpdateWarehouse(orderCopy)) {
                _get(CustomerController.prototype.__proto__ || Object.getPrototypeOf(CustomerController.prototype), "completeOrder", this).call(this, customer);
            }

            warehouseController.updateContainerView();
            warehouseController.updateCapacityView();

            GAME.model.customers = GAME.model.customers.filter(function (item) {
                return customer.id != item.id;
            });
        }

        /**
         * Removes customer from the customer array.
         * @param customer
         */

    }, {
        key: "sendAway",
        value: function sendAway(customer) {
            // TODO Log event in history
            GAME.model.customers = GAME.model.customers.filter(function (item) {
                return customer.id != item.id;
            });

            if (GAME.model.config.penaltySendingCustomerAway) {
                this._updateMoney(-GAME.model.config.penaltySendingCustomerAway);
                toastr.warning(Controller.l("You got a penalty for sending the customer away."));
            }
        }

        /**
         * Validates order if quantity in warehouse for every product is
         * larger than in order.
         */

    }, {
        key: "validateOrder",
        value: function validateOrder(order) {
            return order.products.every(function (product) {
                var quantity = GAME.model.warehouse.getItemQuantity(product);
                return quantity >= product.values.quantity;
            });
        }

        /**
         * @private
         */

    }, {
        key: "_updateCustomerView",
        value: function _updateCustomerView() {
            $("#customer-orders").empty();

            GAME.model.customers.forEach(function (customer) {
                this._updateOrderView(customer);
            }, this);
        }

        /**
         * @private
         */

    }, {
        key: "_updateOrderView",
        value: function _updateOrderView(customer) {
            var _this3 = this;

            if (GAME.model.customers.length) {
                $(".no-customers").remove();
            }

            this._loadTemplate("src/views/template/customer/customerorder.html", "#customer-orders", customer, true).done(function () {
                return _this3.registerEvent(customer.id);
            });
        }
    }]);

    return CustomerController;
}(OrderController);