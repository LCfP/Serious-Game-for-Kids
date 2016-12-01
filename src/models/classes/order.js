class Order
{
    /**
     * Represents an order (only for customer for now)
     *
     * @param products
     */
    constructor(products, time = null, id = null)
    {
        this.products = products;
        // TODO solve this without creating a variable?
        this.orderCost = this.orderCost();
        this.time = time;
        this.id = id;
    }

    /**
     * Calculates order cost
     *
     * @returns {Number}
     */
    orderCost()
    {
        return parseFloat(this.products.reduce((sum, prod) => sum + prod.value(), 0));
    }
}
