class Container extends StorageCore
{
    /**
     * @param {Product} product - The product to be added.
     * @throws Error when the product's shelf size exceeds Container capacity!
     *
     * @override
     */
    addItem(product)
    {
        var availableCapacity = this.capacity - this._usedCapacity();

        if (!(product instanceof Product)) {
            throw new TypeError("Expected a Product, but got a " + product.constructor.name);
        }

        if (availableCapacity < product.shelfSize()) {
            throw new Error("There is no more capacity in this " + this.name + "; cannot add " + product.name);
        }

        this.items.push(product);
    }

    /**
     * Updates perishable products whenever the next day occurs.
     *
     * @augments StorageCore.updatePerishabeProducts()
     */
    updatePerishabeProducts()
    {
        this.items = this.items.filter(function (product) {
            if (product.isPerishable) {
                product.perishable = product.perishable - 1;
            }

            // true is kept, so if product is perishable and perishable == 0 we remove from the list.
            return (!product.isPerishable && product.perishable);
        })
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
