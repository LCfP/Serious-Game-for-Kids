"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}();var _get=function get(object,property,receiver){null===object&&(object=Function.prototype);var desc=Object.getOwnPropertyDescriptor(object,property);if(desc===void 0){var parent=Object.getPrototypeOf(object);if(null===parent)return void 0;return get(parent,property,receiver)}if("value"in desc)return desc.value;var getter=desc.get;return void 0===getter?void 0:getter.call(receiver)};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return call&&("object"==typeof call||"function"==typeof call)?call:self}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}var WarehouseController=function(_Controller){function WarehouseController(){return _classCallCheck(this,WarehouseController),_possibleConstructorReturn(this,(WarehouseController.__proto__||Object.getPrototypeOf(WarehouseController)).apply(this,arguments))}return _inherits(WarehouseController,_Controller),_createClass(WarehouseController,[{key:"view",value:function view(){this._warehouseHelper(),this._containerHelper()}},{key:"updatePerishableProducts",value:function updatePerishableProducts(){GAME.model.warehouse.updatePerishableProducts()}},{key:"updateHoldingCost",value:function updateHoldingCost(){var a=GAME.model.products.reduce(function(b,c){var d=GAME.model.warehouse.getItemQuantity(c);return b+d*c.values.size*GAME.model.config.holdingCostPerSize},0);this._updateMoney(-a)}},{key:"orderUpdateWarehouse",value:function orderUpdateWarehouse(a){var b={FactoryOrder:this._processFactoryOrder,CustomerOrder:this._processCustomerOrder};if(b.hasOwnProperty(a.constructor.name)){var c=$.proxy(b[a.constructor.name],this);return c(a)}}},{key:"updateContainerView",value:function updateContainerView(){$("#containers").empty(),this._containerHelper()}},{key:"updateCapacityView",value:function updateCapacityView(){$("#warehouse-used-capacity").html(GAME.model.warehouse.usedContainerCapacity()),$("#warehouse-max-capacity").html(GAME.model.warehouse.maxContainerCapacity()),$("#warehouse-progress-bar").css({width:GAME.model.warehouse.usedContainerCapacity(!0)+"%"}).attr("aria-valuenow",GAME.model.warehouse.usedContainerCapacity(!0))}},{key:"_processFactoryOrder",value:function _processFactoryOrder(a){var _this2=this,b=a.products.reduce(function(c,d){return c+d.shelfSize()});return b<=GAME.model.warehouse.usedContainerCapacity()?void toastr.error(Controller.l("There is no room left for this order in the warehouse!")):(a.products.forEach(function(c){return _this2._processProduct(c)}),toastr.info(Controller.l("Order has been processed and added to the warehouse!")),!0)}},{key:"_processCustomerOrder",value:function _processCustomerOrder(a){return a.products.forEach(function(b){GAME.model.warehouse.items.map(function(c){return c.items.filter(function(d){if(b.name!=d.name)return d;var e=Math.min(b.values.quantity,d.values.quantity);return b.values.quantity-=e,d.values.quantity-=e,d.values.quantity})})}),!0}},{key:"_processProduct",value:function _processProduct(a){for(var b=0;b<GAME.model.warehouse.items.length;b++){var c=GAME.model.warehouse.items[b],d=c.capacity-c.usedCapacity();if(d>=a.values.size){var e=parseInt(d/a.values.size),f=Math.min(a.values.quantity,e),g=new Product(a.name,$.extend({},a.values));g.values.quantity=f,c.addItem(g),a.values.quantity=a.values.quantity-f}if(!a.values.quantity)break}}},{key:"_warehouseHelper",value:function _warehouseHelper(){this._loadTemplate("src/views/template/warehouse/warehouse.html","#warehouse",GAME.model.warehouse)}},{key:"_containerHelper",value:function _containerHelper(){var _this3=this;GAME.model.warehouse.items.forEach(function(a){a.itemsBySize=_this3._containerDivideProductsBySize(a),a.percentage=a.usedCapacity(!0),_get(WarehouseController.prototype.__proto__||Object.getPrototypeOf(WarehouseController.prototype),"_loadTemplate",_this3).call(_this3,"src/views/template/container/container.html","#containers",a,!0)}),GAME.model.warehouse.items.length<GAME.model.config.warehouseCapacity&&this._renderPurchaseContainer()}},{key:"_renderPurchaseContainer",value:function _renderPurchaseContainer(){var _this4=this;this._loadTemplate("src/views/template/container/purchasecontainer.html","#containers",GAME.model.config,!0).done(function(){$("#purchase-container").click(function(){GAME.model.config.money>GAME.model.config.addContainerCost?(GAME.model.warehouse.addItem(new Container("Rack",GAME.model.config.containerCapacity)),_this4._updateMoney(-GAME.model.config.addContainerCost),_this4.updateContainerView(),_this4.updateCapacityView(),toastr.success(Controller.l("Purchased an additional container!"))):toastr.warning(Controller.l("You cannot afford this!"))})})}},{key:"_containerDivideProductsBySize",value:function _containerDivideProductsBySize(a){return a.items.map(function(b){var c=Math.floor(b.shelfSize()/GAME.model.config.iconPerAmountProductSize),d=b.shelfSize()%GAME.model.config.iconPerAmountProductSize,e=Array(c).fill(GAME.model.config.iconPerAmountProductSize);return d&&e.push(d),e.map(function(f){return{product:b,color:this._percentageColorIndication(b.values.percentage||100),quantity:Math.floor(f/b.values.size)}},this)},this).reduce(function(b,c){return b.concat(c)},[])}},{key:"_percentageColorIndication",value:function _percentageColorIndication(a){var b=["red","yellow","green"],c=b.length;return b[Math.min(Math.floor(a*(c/100)),c-1)]}}]),WarehouseController}(Controller);