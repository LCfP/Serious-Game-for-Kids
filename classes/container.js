class Container extends Storage
{
    /**
     * @param {Product} product - The product to be added.
     * @throws Error when the product's shelf size exceeds Container capacity!
     *
     * @override
     */
    addItem(product)
    {
        if (!product instanceof Product) {
            throw new TypeError("Expected a Product, but got a " + product.constructor.name);
        }

        super.addItem(product);
    }

    /**
     * @override
     */
    _usedCapacity()
    {
        return this.items.reduce((sum, prod) => sum + prod.shelfSize(), 0);
    }

    toString()
    {
        return "I am a Container, specifically a " + this.name + "; Currently I have used " + this._usedCapacity()
            + " out of a total capacity of " + this.capacity + ", and I have " + this.items.length
            + " Products in storage.";
    }
}
