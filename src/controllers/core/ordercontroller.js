class OrderController extends Controller
{
    /**
     * Returns a measure of demand for each product
     */
    randomDemandGenerator(mean, variance)
    {
        return Math.max(OrderController.normalDistribution(mean, variance), 0);
    }

    /**
     * http://stackoverflow.com/a/36481059
     *
     * @param {number} mean=0
     * @param {number} variance=1
     * @returns {number}
     */
    static normalDistribution(mean = 0, variance = 1)
    {
        const u = 1 - Math.random();
        const v = 1 - Math.random();

        const stdNormal =  Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

        return stdNormal * variance + mean;
    }

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

            const protoProduct = GAME.model.products.filter((prod) => prod.name == ordered.name).shift();
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
