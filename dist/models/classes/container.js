"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Container = function (_StorageCore) {
    _inherits(Container, _StorageCore);

    function Container() {
        _classCallCheck(this, Container);

        return _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).apply(this, arguments));
    }

    _createClass(Container, [{
        key: "addItem",

        /**
         * @param {Product} product - The product to be added.
         * @throws Error when the product's shelf size exceeds Container capacity!
         *
         * @override
         */
        value: function addItem(product) {
            var availableCapacity = this.capacity - this.usedCapacity();

            if (availableCapacity < product.shelfSize()) {
                throw new Error("There is no more capacity in this " + this.name + "; cannot add " + product.name);
            }

            this.items.push(product);
        }

        /**
         * Updates perishable products whenever the next day occurs.
         *
         * @augments StorageCore.updatePerishableProducts()
         */

    }, {
        key: "updatePerishableProducts",
        value: function updatePerishableProducts() {
            this.items = this.items.filter(function (product) {
                if (typeof product == "undefined") {
                    return false;
                }

                var initPerishable = GAME.model.products.filter(function (prod) {
                    return prod.name == product.name;
                }).shift().values.perishable - 1;

                product.values.perishable = product.values.perishable - 1;
                product.values.percentage = 100 * product.values.perishable / initPerishable;

                // empty container does not have defined products. Else: product needs to be perishable,
                // and needs to have perished.
                return !(product.values.isPerishable && product.values.perishable <= 0);
            });
        }

        /**
         * @override
         */

    }, {
        key: "usedCapacity",
        value: function usedCapacity() {
            var percentage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var usedCap = this.items.reduce(function (sum, prod) {
                return sum + prod.shelfSize();
            }, 0);

            if (percentage) {
                usedCap = 100 * (usedCap / this.capacity);
            }

            return usedCap;
        }
    }, {
        key: "toString",
        value: function toString() {
            return "I am a Container, specifically a " + this.name + "; Currently I have used " + this.usedCapacity() + " out of a total capacity of " + this.capacity + ", and I have " + this.items.length + " Products in storage.";
        }
    }]);

    return Container;
}(StorageCore);