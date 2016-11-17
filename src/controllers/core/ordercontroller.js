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
            if (!ordered.value) {
                return false
            }

            var protoProduct = MODEL.products.filter((prod) => prod.name == ordered.name).shift();

            return new Product(
                ordered.name,
                ordered.value,
                protoProduct.price,
                protoProduct.size,
                protoProduct.isPerishable,
                protoProduct.perishable
            );
            // see http://stackoverflow.com/a/34481744/4316405
        }).filter(Boolean);
    }

    /**
     * Returns a measure of demand for each product
     */
    randomDemandGenerator()
    {
        return Math.floor(Math.random() * 6);
    }
}