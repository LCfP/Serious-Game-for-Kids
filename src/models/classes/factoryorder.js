class FactoryOrder extends OrderCore
{
    /**
     * @param {Array.Product} products
     * @param {int} id
     * @param {int} transPortDuration
     */
    constructor(products, id, transPortDuration)
    {
        super(products, 24 * transPortDuration);
        this.id = id;
    }
}
