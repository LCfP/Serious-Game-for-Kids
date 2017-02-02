class OrderController extends Controller
{
    /**
     * @abstract
     */
    validateOrder(products)
    {
        throw new Error("Should be implemented by subclasses!")
    }

    completeOrder(item)
    {
        let histController = new HistoryController();
        histController.log(item);
    }

    /**
     * Turns the values from the form into a proper Array of ordered products
     *
     * @param {Array} order - Array of {name, value} objects
     * @returns {Array} products - Array of ordered products
     */
    static _makeOrder(order)
    {
        return order.map(function (ordered) {
            const value = Math.floor(ordered.value);

            if (!value) {
                return false;
            }

            const protoProduct = GAME.model.base.products.filter((prod) => prod.name == ordered.name).shift();
            let product = new Product(ordered.name, $.extend({}, protoProduct.values));

            product.values.quantity = value;

            return product;
        }).filter(Boolean); // see http://stackoverflow.com/a/34481744/4316405
    }

    /**
     * Copies an order
     */
    static _copyOrder(order)
    {
        return OrderController._makeOrder(
            order.products.map((prod) => { return {name: prod.name, value: prod.values.quantity}})
        );
    }
}
