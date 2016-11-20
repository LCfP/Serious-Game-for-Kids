class Order
{
    /**
     * Represents an order (only for customer for now)
     *
     * @param products
     */
    constructor(products)
    {
        this.products = products;
        this.orderCost = this.orderCost();
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
