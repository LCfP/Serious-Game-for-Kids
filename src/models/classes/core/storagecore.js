class StorageCore {
    /**
     * @constructor Represents a Storage.
     *
     * @param {string} name - The display name for this Storage.
     * @param {float} capacity - A unitless measure for the maximum capacity of this Storage.
     */
    constructor(name, capacity)
    {
        this.name = String(name);
        this.capacity = parseFloat(capacity);

        this.items = [];
    }

    /**
     * @param {*} item - Any item to be put in storage. Type checking is delegated to subclasses.
     * @throws Error when capacity would be exceeded by adding this item to the Storage!
     */
    addItem(item)
    {
        var availableCapacity = this.capacity - this._usedCapacity();
        var totalSize = item.quantity * item.size;

        if (availableCapacity <= 0 || availableCapacity < totalSize) {
            throw new Error("There is no more capacity in this " + this.name + "; cannot add " + item.name);
        }

        this.items.push(item);
    }

    /**
     * @param {*} item - Any item to be removed from storage. Type checking _may_ be delegated to subclasses.
     */
    removeItem(item)
    {
        this.items.splice(this.items.indexOf(item), 1);
    }

    /**
     * Updates perishable products whenever the next day occurs.
     *
     * @abstract
     */
    updatePerishabeProducts()
    {
        throw new Error("Needs to be implemented by subclasses!");
    }

    /**
     * Computes a measure of the used capacity. Delegates to subclasses for specific implementations.
     *
     * @abstract
     */
    _usedCapacity()
    {
        throw new Error("Needs to be implemented by subclasses!");
    }
}
