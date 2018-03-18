import Controller from './core/controller';
import Product from '../models/classes/product';


export default class OrderProcessController extends Controller
{
    constructor(order)
    {
        super();

        this.order = order;
    }

    /**
     * Processes the order, either into the warehouse, or to the customer (depending on order type). For
     * customer orders, FIFO is used to fulfill perishable demand, where the most perished products are
     * the first to leave the warehouse.
     */
    processOrder()
    {
        this.order.products.forEach(product => {
            while (product.values.quantity)
            {
                if (product.values.isPerishable && this.order.constructor.name === "CustomerOrder") {
                    this._perishableOrder(product);
                } else {
                    this._nonPerishableOrder(product);
                }
            }
        });

        return this.order.products.every(product => product.values.quantity === 0);
    }

    /**
     * @private
     */
    _perishableOrder(product)
    {
        const mostPerishedContainer = GAME.model.warehouse.items[
            this._indexMostPerishedContainer(product)];

        const perishedQuantity = this._grabPerishedQuantity(product, mostPerishedContainer);
        let perishedProduct = new Product(product.name, {quantity: perishedQuantity});

        product.values.quantity -= (perishedQuantity - mostPerishedContainer.removeItem(perishedProduct));

        return product.values.quantity;
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

    /**
     * Grabs the index of the container containing the most perished product of type `product'
     *
     * @param {Product} product
     *
     * @private
     */
    _indexMostPerishedContainer(product)
    {
        const perishables = GAME.model.warehouse.items.map(container => {
            return Math.min(...container.items
                .filter(item => item.name == product.name)
                .map(item => item.values.perishable));
        });

        return perishables.indexOf(Math.min(...perishables));
    }

    /**
     * Grabs how many of the most perished product are left in container `mostPerishedContainer'
     *
     * @param {Product} product
     * @param {Container} mostPerishedContainer
     *
     * @private
     */
    _grabPerishedQuantity(product, mostPerishedContainer)
    {
        const perishedProduct = mostPerishedContainer.items
            .find(item => item.name == product.name);

        return Math.min(perishedProduct.values.quantity, product.values.quantity);
    }
}
