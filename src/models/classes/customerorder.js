class CustomerOrder extends OrderCore
{
    constructor(products)
    {
        super(products, 0);
    }

    /**
     * @override
     */
    orderCost()
    {
        return super.orderCost(true);
    }
}
