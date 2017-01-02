"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FactoryOrder = function (_OrderCore) {
    _inherits(FactoryOrder, _OrderCore);

    function FactoryOrder(products) {
        _classCallCheck(this, FactoryOrder);

        var _this = _possibleConstructorReturn(this, (FactoryOrder.__proto__ || Object.getPrototypeOf(FactoryOrder)).call(this, products, 24 * GAME.model.config.orderTransportDurationDays));

        _this.id = Math.max.apply(Math, _toConsumableArray(GAME.model.orders.map(function (order) {
            return order.id + 1;
        })).concat([0]));
        return _this;
    }

    return FactoryOrder;
}(OrderCore);