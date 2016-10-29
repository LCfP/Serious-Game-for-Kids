class Container
{
    /**
     * @constructor Represents a Container.
     *
     * @param {string} name - The display name for this Container.
     * @param {float} capacity - A unitless measure for the maximum capacity of this Container.
     */
    constructor(name, capacity)
    {
        this.name = String(name);
        this.capacity = parseFloat(capacity);

        this.products = [];
    }

    /**
     * @param {Product} product - The product to be added
     * @throws Error when the product's shelf size exceeds Container capacity!
     */
    addProduct(product)
    {
        var availableCapacity = this.capacity - this._usedCapacity();

        // Not enough space!
        if (product.shelfSize() > availableCapacity) {
            throw new Error(
                "This product is a little too big for this Container! We have " + availableCapacity + " space left," +
                " but the product in question requires " + product.shelfSize()
            );
        } else {
            this.products.push(product);
        }

    }

    _usedCapacity()
    {
        return this.products.reduce((sum, prod) => sum + prod.shelfSize(), 0);
    }

    toString()
    {
        return "I am a Container, specifically a " + this.name + "; Currently I have used " + this._usedCapacity()
            + " out of a total capacity of " + this.capacity + ", and I have " + this.products.length
            + " Products in storage.";
    }
}
