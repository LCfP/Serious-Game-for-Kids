"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Storage = function (_StorageCore) {
    _inherits(Storage, _StorageCore);

    function Storage() {
        _classCallCheck(this, Storage);

        return _possibleConstructorReturn(this, (Storage.__proto__ || Object.getPrototypeOf(Storage)).apply(this, arguments));
    }

    _createClass(Storage, [{
        key: "addItem",

        /**
         * @param {Container} container - The container to be added.
         * @throws Error when the extra Container would exceed Storage capacity!
         *
         * @override
         */
        value: function addItem(container) {
            if (!(container instanceof Container)) {
                throw new TypeError("Expected a Container, but got a " + container.constructor.name);
            }

            _get(Storage.prototype.__proto__ || Object.getPrototypeOf(Storage.prototype), "addItem", this).call(this, container);
        }

        /**
         * For a given product, computes the total quantity currently in the warehouse.
         *
         * @param {Product} product - The product
         * @returns {Number}
         */

    }, {
        key: "getItemQuantity",
        value: function getItemQuantity(product) {
            var sum = function sum(_sum, elem) {
                return _sum + elem;
            };

            return this.items.map(function (container) {
                return container.items.map(function (item) {
                    return product.name == item.name ? item.values.quantity : 0;
                }).reduce(sum, 0);
            }).reduce(sum, 0);
        }

        /**
         * Updates perishable products whenever the next day occurs.
         *
         * @augments StorageCore.updatePerishableProducts()
         */

    }, {
        key: "updatePerishableProducts",
        value: function updatePerishableProducts() {
            this.items.forEach(function (container) {
                container.updatePerishableProducts();
            });
        }

        /**
         * @override
         */

    }, {
        key: "usedCapacity",
        value: function usedCapacity() {
            return this.items.length;
        }
    }, {
        key: "usedContainerCapacity",
        value: function usedContainerCapacity() {
            var percentage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var usedCap = this.items.reduce(function (sum, container) {
                return sum + container.usedCapacity();
            }, 0);

            if (percentage) {
                usedCap = 100 * (usedCap / this.maxContainerCapacity());
            }

            return usedCap;
        }
    }, {
        key: "maxContainerCapacity",
        value: function maxContainerCapacity() {
            return this.items.reduce(function (sum, container) {
                return sum + container.capacity;
            }, 0);
        }
    }, {
        key: "toString",
        value: function toString() {
            return "I am a Storage; currently I have " + this.usedCapacity() + " Containers, out of a maximum of " + this.capacity;
        }
    }]);

    return Storage;
}(StorageCore);