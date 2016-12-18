class Storage extends StorageCore
{
    /**
     * @param {Container} container - The container to be added.
     * @throws Error when the extra Container would exceed Storage capacity!
     *
     * @override
     */
    addItem(container)
    {
        if (!(container instanceof Container)) {
            throw new TypeError("Expected a Container, but got a " + container.constructor.name);
        }

        super.addItem(container);
    }

    /**
     * For a given product, computes the total quantity currently in the warehouse.
     *
     * @param {Product} product - The product
     * @returns {Number}
     */
    getItemQuantity(product)
    {
        let sum = (sum, elem) => sum + elem;

        return this.items.map(function (container) {
            return container.items.map(function (item) {
                return product.name == item.name ? item.values.quantity : 0;
            }).reduce(sum, 0);
        }).reduce(sum, 0);
    }

    /**
     * Updates perishable products whenever the next day occurs.
     *
     * @augments StorageCore.updatePerishableProducts()
     */
    updatePerishableProducts()
    {
        this.items.forEach(function (container) {
            container.updatePerishableProducts();
        });
    }

    /**
     * @override
     */
    usedCapacity()
    {
        return this.items.length;
    }

    usedContainerCapacity(percentage = false)
    {
        let usedCap = this.items.reduce((sum, container) => sum + container.usedCapacity(), 0);

        if (percentage) {
            usedCap = 100 * (usedCap / this.maxContainerCapacity());
        }

        return usedCap;
    }

    maxContainerCapacity()
    {
        return this.items.reduce((sum, container) => sum + container.capacity, 0);
    }

    toString()
    {
        return "I am a Storage; currently I have " + this.usedCapacity() + " Containers, out of a maximum of "
            + this.capacity;
    }
}
