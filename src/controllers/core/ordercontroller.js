class OrderController extends Controller
{
    /**
     * Turns the values from the form into a proper Array of ordered products
     *
     * @param {Array} order - Array of {name, value} objects
     * @returns {Array} products - Array of ordered products
     */
    static _makeOrder(order)
    {
        return order.map(function (ordered) {
            var value = parseInt(ordered.value);

            if (!value) {
                return false;
            }

            var protoProduct = GAME.model.products.filter((prod) => prod.name == ordered.name).shift();

            var product = new Product(ordered.name, $.extend({}, protoProduct.values));
            product.values.quantity = value;

            return product;
        }).filter(Boolean); // see http://stackoverflow.com/a/34481744/4316405
    }

    /**
     * Returns a measure of demand for each product
     */
    randomDemandGenerator(mean, variance)
    {
        // TODO edit variance and mean
        return Math.max(OrderController.normalDistribution(mean, variance), 0);
    }

    /**
     * http://stackoverflow.com/a/36481059
     *
     * @param mean
     * @param variance
     * @returns {number}
     */
    static normalDistribution(mean = 0, variance = 1)
    {
        var u = 1 - Math.random();
        var v = 1 - Math.random();

        let stdNormal =  Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

        return stdNormal * variance + mean;
    }

    /**
     * @abstract
     */
    validateOrder(products)
    {
        throw new Error("Should be implemented by subclasses!")
    }
}
