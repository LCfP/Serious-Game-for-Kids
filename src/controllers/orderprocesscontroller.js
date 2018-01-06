import Controller from './core/controller';


export default class OrderProcessController extends Controller
{
    constructor(order)
    {
        super();

        this.order = order;
    }

    /**
     * TODO
     */
    processOrder()
    {
        this.order.products.forEach(product => {
            while (product.values.quantity) {

                if (product.values.isPerishable === true && this.order.constructor.name == "CustomerOrder") {
                    this._perishableOrder(product);
                } else {
                    this._nonPerishableOrder(product);
                }
            }
        });

        if (this.order.products.every(product => product.values.quantity === 0)) {
            return true;
        }
    }

    /**
     * @private
     */
    _perishableOrder(product)
    {

        // Code underneath creates an array (perishableArray) which contains the lowest perished value
        // (so, most perished product) of the order product, of all containers.
        //
        let perishableArray = [];
        GAME.model.warehouse.items.forEach(function(container) {

            let perishables = container.items
                .filter(function(item) {
                    return item.name == product.name;
                })
                .map(function(item) {
                    return item.values.perishable;
                });
            perishableArray.push(Math.min(...perishables));
        });


        let min = perishableArray[0];
        let minIndex = 0;

        // Here, the index of the minimum of the array is found, which corresponds with the index of the container.

        for (let i =1; i < perishableArray.length; i++) {
            if (perishableArray[i] < min && perishableArray[i] != 0) {
                minIndex = i;
                min = perishableArray[i];
            }
        }

        // Now, I want to remove the product from the container of index minIndex, though I'm not sure exactly how.

        GAME.model.warehouse.items.every(container => {
            product.values.quantity = GAME.model.warehouse.items[minIndex].removeItem.bind(container)(product);
            return product.values.quantity;
        });
    }

    /**
     * @private
     */
    _nonPerishableOrder(product)
    {
        // see http://stackoverflow.com/a/2641374/4316405
        GAME.model.warehouse.items.every(container => {
            const cases = {
                "FactoryOrder": container.addItem.bind(container),
                "CustomerOrder": container.removeItem.bind(container)
            };

            product.values.quantity = cases[this.order.constructor.name](product);
            return product.values.quantity;
        });
    }

    _findIndexOfMinimalValue(arr) {
        if (arr.length === 0) {
            return -1;
        }

        let min = arr[0];
        let minIndex = 0;

        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < min) {
                minIndex = i;
                min = arr[i];
            }
        }

        return minIndex;
    }

}