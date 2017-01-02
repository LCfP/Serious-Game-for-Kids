'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Customer = function () {
    /**
     * @constructor Represents a Customer
     *
     * @param products
     */
    function Customer(products) {
        _classCallCheck(this, Customer);

        this.name = this.generateName();
        this.order = new CustomerOrder(products);

        this.id = Math.max.apply(Math, _toConsumableArray(GAME.model.customers.map(function (customer) {
            return customer.id + 1;
        })).concat([0]));
    }

    /**
     * Generates a random name for the customer
     * TODO: make name generation random
     *
     * @returns {string}
     */


    _createClass(Customer, [{
        key: 'generateName',
        value: function generateName() {
            return String('Henk');
        }
    }]);

    return Customer;
}();