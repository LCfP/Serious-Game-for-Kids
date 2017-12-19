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
        GAME.model.warehouse.items.forEach(container => {
            //this._sortPerishables(container);

            product.values.quantity = container.removeItem.bind(container)(product);
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

    //Maybe move to container?
    _sortPerishables(container)
    {
        container.items.forEach()
    }
}

