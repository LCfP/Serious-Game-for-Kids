class CustomerOrder extends OrderCore
{
    constructor(products)
    {
        super(products, 0);
    }

    orderCost()
    {
        return super.orderCost(true);
    }
}
