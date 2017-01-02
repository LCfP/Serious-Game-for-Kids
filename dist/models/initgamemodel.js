"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InitGameModel = function (_Model) {
    _inherits(InitGameModel, _Model);

    function InitGameModel() {
        _classCallCheck(this, InitGameModel);

        return _possibleConstructorReturn(this, (InitGameModel.__proto__ || Object.getPrototypeOf(InitGameModel)).apply(this, arguments));
    }

    _createClass(InitGameModel, [{
        key: "setupCallback",

        /**
         * @override
         */
        value: function setupCallback() {
            this.model.warehouse = new Storage("Warehouse", this.model.config.warehouseCapacity);
            this.model.factory = new Factory("Factory", this.model.products);

            for (var i = 0; i < this.model.config.warehouseContainers; i++) {
                this.model.warehouse.addItem(new Container("Rack", this.model.config.containerCapacity));
            }

            this.toObject();

            // callback for when the MODEL exists in the window
            initGame();
        }
    }]);

    return InitGameModel;
}(Model);