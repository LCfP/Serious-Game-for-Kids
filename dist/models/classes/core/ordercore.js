"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OrderCore = function () {
    /**
     *
     * @param {Product[]} products - List of products in this Order
     * @param {int} time - Duration for Order to arrive
     */
    function OrderCore(products, time) {
        _classCallCheck(this, OrderCore);

        this.products = products;

        this.initDuration = time;
        this.time = time;
    }

    /**
     * Calculates order cost.
     * @see ProductCore.stockValue
     *
     * @param {boolean} sales=false - Purchase or sales price.
     * @returns {float}
     */


    _createClass(OrderCore, [{
        key: "orderCost",
        value: function orderCost() {
            var sales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!this.products) {
                return 0;
            }

            return this.products.reduce(function (sum, prod) {
                return sum + prod.stockValue(sales);
            }, 0);
        }
    }]);

    return OrderCore;
}();