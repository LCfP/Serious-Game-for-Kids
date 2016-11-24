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

    usedContainerCapacity()
    {
        return this.items.reduce((sum, container) => sum + container.usedCapacity(), 0);
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
