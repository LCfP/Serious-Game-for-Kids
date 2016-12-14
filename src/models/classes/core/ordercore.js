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
     * Calculates order cost.
     * @see ProductCore.stockValue
     *
     * @param {bool} sales=false - Purchase or sales price.
     * @returns {float}
     */
    orderCost(sales = false)
    {
        return this.products.reduce((sum, prod) => sum + prod.stockValue(sales), 0);
    }
}
