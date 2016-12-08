class ProductCore
{
    /**
     * @constructor Represents a product.
     *
     * @param {string} name - The display name for this product.
     * @param {object} values - The values, as an object. These are the same as those in `products.json`, excluding `name`.
     */
    constructor(name, values)
    {
        this.name = String(name);
        this.values = values;
    }

    /**
     * Calculates shelf size, as the total quantity times the unit size.
     */
    shelfSize()
    {
        return this.values.size * this.values.quantity;
    }

    /**
     * Calculates the purchase value/cost.
     */
    stockValue()
    {
        return parseFloat(this.values.price * this.values.quantity);
    }
}
