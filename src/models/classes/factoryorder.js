import OrderCore from './core/ordercore';


export default class FactoryOrder extends OrderCore
{
    /**
     * @param {Product[]} products
     * @param {int} id
     * @param {int} transPortDuration
     */
    constructor(products, id, transPortDuration)
    {
        super(products, 24 * transPortDuration);
        this.id = id;
    }
}
