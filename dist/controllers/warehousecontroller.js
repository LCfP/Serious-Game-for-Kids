"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WarehouseController = function (_Controller) {
    _inherits(WarehouseController, _Controller);

    function WarehouseController() {
        _classCallCheck(this, WarehouseController);

        return _possibleConstructorReturn(this, (WarehouseController.__proto__ || Object.getPrototypeOf(WarehouseController)).apply(this, arguments));
    }

    _createClass(WarehouseController, [{
        key: "view",
        value: function view() {
            this._warehouseHelper();
            this._containerHelper();
        }

        /**
         * @see Storage.updatePerishableProducts
         */

    }, {
        key: "updatePerishableProducts",
        value: function updatePerishableProducts() {
            GAME.model.warehouse.updatePerishableProducts();
        }

        /**
         * Updates holding cost, every time it is invoked. See the config for the current parameter values,
         * used in formula: quantity * product size * holdingCostPerSize.
         */

    }, {
        key: "updateHoldingCost",
        value: function updateHoldingCost() {
            var cost = GAME.model.products.reduce(function (sum, product) {
                var quantity = GAME.model.warehouse.getItemQuantity(product);
                return sum + quantity * product.values.size * GAME.model.config.holdingCostPerSize;
            }, 0);

            this._updateMoney(-cost);
        }

        /**
         * Adds the contents of an order to the Warehouse.
         *
         * @param {OrderCore} order - The Order object.
         */

    }, {
        key: "orderUpdateWarehouse",
        value: function orderUpdateWarehouse(order) {
            var cases = {
                "FactoryOrder": this._processFactoryOrder,
                "CustomerOrder": this._processCustomerOrder
            };

            if (cases.hasOwnProperty(order.constructor.name)) {
                var func = $.proxy(cases[order.constructor.name], this);
                return func(order);
            }
        }

        /**
         * Helper method to refresh the containers.
         */

    }, {
        key: "updateContainerView",
        value: function updateContainerView() {
            $("#containers").empty();
            this._containerHelper();
        }
    }, {
        key: "updateCapacityView",
        value: function updateCapacityView() {
            // text heading
            $("#warehouse-used-capacity").html(GAME.model.warehouse.usedContainerCapacity());
            $("#warehouse-max-capacity").html(GAME.model.warehouse.maxContainerCapacity());

            // progress bar
            $("#warehouse-progress-bar").css({ width: GAME.model.warehouse.usedContainerCapacity(true) + "%" }).attr("aria-valuenow", GAME.model.warehouse.usedContainerCapacity(true));
        }

        /**
         * @private
         */

    }, {
        key: "_processFactoryOrder",
        value: function _processFactoryOrder(order) {
            var _this2 = this;

            var capacity = order.products.reduce(function (sum, prod) {
                return sum + prod.shelfSize();
            });

            if (capacity <= GAME.model.warehouse.usedContainerCapacity()) {
                toastr.error(Controller.l("There is no room left for this order in the warehouse!"));
                // TODO try to fit what fits? - context
            } else {
                // add products to the containers.
                order.products.forEach(function (product) {
                    return _this2._processProduct(product);
                });
                toastr.info(Controller.l("Order has been processed and added to the warehouse!"));

                return true;
            }
        }

        /**
         * @private
         */

    }, {
        key: "_processCustomerOrder",
        value: function _processCustomerOrder(order) {
            // TODO ugly :(
            order.products.forEach(function (product) {
                GAME.model.warehouse.items.map(function (container) {
                    return container.items.filter(function (item) {
                        if (product.name != item.name) {
                            return item;
                        }

                        var removedQuantity = Math.min(product.values.quantity, item.values.quantity);
                        product.values.quantity -= removedQuantity;
                        item.values.quantity -= removedQuantity;

                        return item.values.quantity;
                    });
                });
            });

            return true;
        }

        /**
         * @private
         */

    }, {
        key: "_processProduct",
        value: function _processProduct(product) {
            for (var i = 0; i < GAME.model.warehouse.items.length; i++) {
                var container = GAME.model.warehouse.items[i];
                var availableCapacity = container.capacity - container.usedCapacity();

                // can fit at least one product!
                if (availableCapacity >= product.values.size) {
                    var maxProducts = parseInt(availableCapacity / product.values.size);
                    var addedQuantity = Math.min(product.values.quantity, maxProducts);

                    var partialProduct = new Product(product.name, $.extend({}, product.values));
                    partialProduct.values.quantity = addedQuantity;
                    container.addItem(partialProduct);

                    product.values.quantity = product.values.quantity - addedQuantity;
                }

                // this product has been stored by now.
                if (!product.values.quantity) {
                    break;
                }
            }
        }

        /**
         * Helper method to display the warehouse
         *
         * @private
         */

    }, {
        key: "_warehouseHelper",
        value: function _warehouseHelper() {
            this._loadTemplate("src/views/template/warehouse/warehouse.html", "#warehouse", GAME.model.warehouse);
        }

        /**
         * Helper method to fill the warehouse view with containers.
         *
         * @private
         */

    }, {
        key: "_containerHelper",
        value: function _containerHelper() {
            var _this3 = this;

            GAME.model.warehouse.items.forEach(function (container) {
                // group by size, for the image icons
                container.itemsBySize = _this3._containerDivideProductsBySize(container);

                // for the progress bar
                container.percentage = container.usedCapacity(true);

                _get(WarehouseController.prototype.__proto__ || Object.getPrototypeOf(WarehouseController.prototype), "_loadTemplate", _this3).call(_this3, "src/views/template/container/container.html", "#containers", container, true);
            });

            if (GAME.model.warehouse.items.length < GAME.model.config.warehouseCapacity) {
                this._renderPurchaseContainer();
            }
        }

        /**
         * Helper method for rendering another not-yet-purchased container. Allows for increasing the size of the
         * warehouse.
         *
         * @private
         */

    }, {
        key: "_renderPurchaseContainer",
        value: function _renderPurchaseContainer() {
            var _this4 = this;

            var event = function event() {
                $("#purchase-container").click(function () {
                    if (GAME.model.config.money > GAME.model.config.addContainerCost) {
                        GAME.model.warehouse.addItem(new Container("Rack", GAME.model.config.containerCapacity));

                        _this4._updateMoney(-GAME.model.config.addContainerCost);
                        _this4.updateContainerView();
                        _this4.updateCapacityView();

                        toastr.success(Controller.l("Purchased an additional container!"));
                    } else {
                        toastr.warning(Controller.l("You cannot afford this!"));
                    }
                });
            };

            this._loadTemplate("src/views/template/container/purchasecontainer.html", "#containers", GAME.model.config, true).done(event);
        }

        /**
         * Divides the container products into image blocks, so each items can be represented
         * as an icon (per `iconPerAmountProductSize` size).
         *
         * @private
         */

    }, {
        key: "_containerDivideProductsBySize",
        value: function _containerDivideProductsBySize(container) {
            return container.items.map(function (item) {
                var amountIcons = Math.floor(item.shelfSize() / GAME.model.config.iconPerAmountProductSize);
                var remainder = item.shelfSize() % GAME.model.config.iconPerAmountProductSize;

                // list of [iconAmount, iconAmount, iconAmount, ..., remainder]
                var groupingAmount = new Array(amountIcons).fill(GAME.model.config.iconPerAmountProductSize);

                // This item's `shelfSize` may not be a multiple of `iconPerAmountProductSize`
                if (remainder) {
                    groupingAmount.push(remainder);
                }

                // map into object and return
                return groupingAmount.map(function (size) {
                    return {
                        "product": item,
                        "color": this._percentageColorIndication(item.values.percentage || 100),
                        // this grouping's size, divided by unit product size = quantity
                        "quantity": Math.floor(size / item.values.size)
                    };
                }, this);
            }, this).reduce(function (array, other) {
                return array.concat(other);
            }, []);
        }

        /**
         * Maps the product perishability (as a percentage of initial) to a color code.
         * TODO: think about how these ranges should be, and proper colours (css).
         *
         * @private
         */

    }, {
        key: "_percentageColorIndication",
        value: function _percentageColorIndication(percentage) {
            var indicators = ["red", "yellow", "green"]; // these are css colours, not just 'names'
            var n = indicators.length;

            return indicators[Math.min(Math.floor(percentage * (n / 100)), n - 1)];
        }
    }]);

    return WarehouseController;
}(Controller);