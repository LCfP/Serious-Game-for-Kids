class OrderCore
{
    /**
     *
     * @param {Product[]} products - List of products in this Order
     * @param {int} time - Duration for Order to arrive
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
     * @param {boolean} sales=false - Purchase or sales price.
     * @returns {float}
     */
    orderCost(sales = false)
    {
        if (!this.products) {
            return 0;
        }

        return this.products.reduce((sum, prod) => sum + prod.stockValue(sales), 0);
    }
}
