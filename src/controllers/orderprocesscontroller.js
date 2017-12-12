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
        });

        if (this.order.products.every(product => product.values.quantity === 0)) {
            return true;
        }
    }
}
