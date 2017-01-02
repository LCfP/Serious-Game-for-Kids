"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OrderController = function (_Controller) {
    _inherits(OrderController, _Controller);

    function OrderController() {
        _classCallCheck(this, OrderController);

        return _possibleConstructorReturn(this, (OrderController.__proto__ || Object.getPrototypeOf(OrderController)).apply(this, arguments));
    }

    _createClass(OrderController, [{
        key: "randomDemandGenerator",

        /**
         * Returns a measure of demand for each product
         */
        value: function randomDemandGenerator(mean, variance) {
            return Math.max(OrderController.normalDistribution(mean, variance), 0);
        }

        /**
         * http://stackoverflow.com/a/36481059
         *
         * @param {number} mean=0
         * @param {number} variance=1
         * @returns {number}
         */

    }, {
        key: "validateOrder",


        /**
         * @abstract
         */
        value: function validateOrder(products) {
            throw new Error("Should be implemented by subclasses!");
        }
    }, {
        key: "completeOrder",
        value: function completeOrder(item) {
            var histController = new HistoryController();
            histController.log(item);
        }

        /**
         * Turns the values from the form into a proper Array of ordered products
         *
         * @param {Array} order - Array of {name, value} objects
         * @returns {Array} products - Array of ordered products
         */

    }], [{
        key: "normalDistribution",
        value: function normalDistribution() {
            var mean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var variance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            var u = 1 - Math.random();
            var v = 1 - Math.random();

            var stdNormal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

            return stdNormal * variance + mean;
        }
    }, {
        key: "_makeOrder",
        value: function _makeOrder(order) {
            return order.map(function (ordered) {
                var value = Math.floor(ordered.value);

                if (!value) {
                    return false;
                }

                var protoProduct = GAME.model.products.filter(function (prod) {
                    return prod.name == ordered.name;
                }).shift();
                var product = new Product(ordered.name, $.extend({}, protoProduct.values));

                product.values.quantity = value;

                return product;
            }).filter(Boolean); // see http://stackoverflow.com/a/34481744/4316405
        }

        /**
         * Copies an order
         */

    }, {
        key: "_copyOrder",
        value: function _copyOrder(order) {
            return OrderController._makeOrder(order.products.map(function (prod) {
                return { name: prod.name, value: prod.values.quantity };
            }));
        }
    }]);

    return OrderController;
}(Controller);