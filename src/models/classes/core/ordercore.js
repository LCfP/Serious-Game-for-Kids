class OrderCore
{
    constructor(products, time)
    {
        this.products = products;
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
