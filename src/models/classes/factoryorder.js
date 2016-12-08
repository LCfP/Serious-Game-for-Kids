class FactoryOrder extends OrderCore
{
    constructor(products)
    {
        super(products, 24 * GAME.model.config.orderTransportDurationDays);

        this.id = GAME.model.orders.length;
    }
}
