class FactoryOrder extends OrderCore
{
    constructor(products)
    {
        super(products, 24 * GAME.model.config.orderTransportDurationDays);

        this.id = Math.max(GAME.model.orders.map(order => order.id + 1));
    }
}
