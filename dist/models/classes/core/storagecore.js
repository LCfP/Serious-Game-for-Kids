"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StorageCore = function () {
    /**
     * @constructor Represents a Storage.
     *
     * @param {string} name - The display name for this Storage.
     * @param {float} capacity - A unitless measure for the maximum capacity of this Storage.
     */
    function StorageCore(name, capacity) {
        _classCallCheck(this, StorageCore);

        this.name = String(name);
        this.capacity = parseFloat(capacity);

        this.items = [];
    }

    /**
     * @param {*} item - Any item to be put in storage. Type checking is delegated to subclasses.
     * @throws Error when capacity would be exceeded by adding this item to the Storage!
     */


    _createClass(StorageCore, [{
        key: "addItem",
        value: function addItem(item) {
            var availableCapacity = this.capacity - this.usedCapacity();

            if (availableCapacity <= 0) {
                throw new Error("There is no more capacity in this " + this.name + "; cannot add " + item.name);
            }

            this.items.push(item);
        }

        /**
         * @param {*} item - Any item to be removed from storage. Type checking _may_ be delegated to subclasses.
         */

    }, {
        key: "removeItem",
        value: function removeItem(item) {
            this.items.splice(this.items.indexOf(item), 1);
        }

        /**
         * Updates perishable products whenever the next day occurs.
         *
         * @abstract
         */

    }, {
        key: "updatePerishableProducts",
        value: function updatePerishableProducts() {
            throw new Error("Needs to be implemented by subclasses!");
        }

        /**
         * Computes a measure of the used capacity. Delegates to subclasses for specific implementations.
         *
         * @abstract
         */

    }, {
        key: "usedCapacity",
        value: function usedCapacity() {
            throw new Error("Needs to be implemented by subclasses!");
        }
    }]);

    return StorageCore;
}();