class OrderCore
{
    constructor(products, time)
    {
        this.products = products;
        // TODO solve this without creating a variable?
        this.orderCost = this.orderCost();
        this.time = time;
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
