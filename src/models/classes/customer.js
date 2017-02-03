class Customer
{
    /**
     * @constructor Represents a Customer
     *
     * @param {Object} model
     * @param {Product[]} products
     * @param {int} id
     * @param {boolean} isStructural
     */
    constructor(model, products, id, isStructural)
    {
        this.model = model;
        this.id = id;

        if (isStructural) {
            const structuralCusts = this.model.base.customers.structural;
            this.customer = structuralCusts[Math.floor(Math.random() * structuralCusts.length)];
        } else {
            const types = this.model.base.products.map(prod => prod.values.type)
                .filter((type, i, types) => types.indexOf(type) === i);

            this.customer = {
                name: this._generateName(),
                type: [types[Math.floor(Math.random() * types.length)]]
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
    _generateName()
    {
        const customerNames = this.model.base.customers.random[this.model.config.language];
        return customerNames[Math.floor(Math.random() * customerNames.length)]
    }
}
