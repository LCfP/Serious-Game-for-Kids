"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProductCore = function () {
    /**
     * @constructor Represents a product.
     *
     * @param {string} name - The display name for this product.
     * @param {object} values - The values, as an object. These are the same as those in `products.json`, excluding `name`.
     */
    function ProductCore(name, values) {
        _classCallCheck(this, ProductCore);

        this.name = String(name);
        this.values = values;
    }

    /**
     * Calculates shelf size, as the total quantity times the unit size.
     */


    _createClass(ProductCore, [{
        key: "shelfSize",
        value: function shelfSize() {
            return this.values.size * this.values.quantity;
        }

        /**
         * Calculates the purchase value/cost.
         *
         * @param {boolean} sales=false - Purchase or sales price (factory vs. customer price).
         */

    }, {
        key: "stockValue",
        value: function stockValue() {
            var sales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var price = sales ? this.values.salesPrice : this.values.price;

            return parseFloat(price * this.values.quantity);
        }
    }]);

    return ProductCore;
}();