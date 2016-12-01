class FactoryOrder extends OrderCore
{
    constructor(products)
    {
        var time = GAME.model.config.orderTransportDuration;
        var id = GAME.model.orders.length;

        super(products, time, id);
    }
}
