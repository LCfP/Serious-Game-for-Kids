class Customer
{
    /**
     * @constructor Represents a Customer
     *
     * @param {int} timestamp
     * @param {Product[]} products
     * @param {int} id
     * @param {boolean} isStructural
     * @param {Object} model=GAME.model
     */
    constructor(timestamp, products, id, isStructural, model = GAME.model)
    {
        this.timestamp = timestamp;
        this.id = id;

        if (isStructural) {
            const structuralCusts = model.base.customers.structural;
            this.customer = structuralCusts[Math.floor(Math.random() * structuralCusts.length)];
        } else {
            const types = model.base.products.map(prod => prod.values.type)
                .filter((type, i, types) => types.indexOf(type) === i);

            this.customer = {
                name: this._generateName(model),
                type: [types[Math.floor(Math.random() * types.length)]],
                expectation: {
                    delivery: model.config.expectedDelivery,
                }
            }
        }

        products = products.filter(prod => this.customer.type.indexOf(prod.values.type) > -1);
        this.order = new CustomerOrder(products);
    }

    /**
     * Generates a random name for the customer
     *
     * @private
     */
    _generateName(model)
    {
        const customerNames = model.base.customers.random[model.config.language];
        return customerNames[Math.floor(Math.random() * customerNames.length)]
    }
}
