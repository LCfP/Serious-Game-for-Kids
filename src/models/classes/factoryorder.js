class FactoryOrder extends OrderCore
{
    constructor(products)
    {
        var time = GAME.model.config.orderTransportDuration;
        super(products, time);

        this.id = GAME.model.orders.length;
    }
}
