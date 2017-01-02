"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return call&&("object"==typeof call||"function"==typeof call)?call:self}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}var Container=function(_StorageCore){function Container(){return _classCallCheck(this,Container),_possibleConstructorReturn(this,(Container.__proto__||Object.getPrototypeOf(Container)).apply(this,arguments))}return _inherits(Container,_StorageCore),_createClass(Container,[{key:"addItem",value:function addItem(a){var b=this.capacity-this.usedCapacity();if(b<a.shelfSize())throw new Error("There is no more capacity in this "+this.name+"; cannot add "+a.name);this.items.push(a)}},{key:"updatePerishableProducts",value:function updatePerishableProducts(){this.items=this.items.filter(function(a){if("undefined"==typeof a)return!1;var b=GAME.model.products.filter(function(c){return c.name==a.name}).shift().values.perishable-1;return a.values.perishable=a.values.perishable-1,a.values.percentage=100*a.values.perishable/b,!(a.values.isPerishable&&0>=a.values.perishable)})}},{key:"usedCapacity",value:function usedCapacity(){var a=0<arguments.length&&void 0!==arguments[0]&&arguments[0],b=this.items.reduce(function(c,d){return c+d.shelfSize()},0);return a&&(b=100*(b/this.capacity)),b}},{key:"toString",value:function toString(){return"I am a Container, specifically a "+this.name+"; Currently I have used "+this.usedCapacity()+" out of a total capacity of "+this.capacity+", and I have "+this.items.length+" Products in storage."}}]),Container}(StorageCore);