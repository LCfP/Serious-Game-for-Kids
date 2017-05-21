import StorageCore from './core/storagecore';


export default class Factory extends StorageCore
{
    constructor(name, products)
    {
        super(name, 0);
        this.products = products;
    }

    /**
     * Groups the products by product type.
     *
     * @returns object - Object of name - array values, with arrays of Products.
     */
    groupByProductType()
    {
        return this.products.reduce(function (groups, prod) {
            if (groups.hasOwnProperty(prod.values.type)) {
                groups[prod.values.type].push(prod);
            } else {
                groups[prod.values.type] = [prod];
            }

            return groups;
        }, {});
    }
}
