class OrderCore
{
    /**
     *
     * @param products - List of products in this Order
     * @param time - Duration for Order to arrive
     */
    constructor(products, time)
    {
        this.products = products;

        this.initDuration = time;
        this.time = time;
    }

    /**
     * Calculates order cost
     *
     * @returns {float}
     */
    orderCost()
    {
        return this.products.reduce((sum, prod) => sum + prod.stockValue(), 0);
    }
}
