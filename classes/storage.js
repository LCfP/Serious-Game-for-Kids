class Storage
{
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

        if (!availableCapacity) {
            throw new Error("There is no more capacity in this " + this.name);
        }

        this.items.push(item);
    }

    /**
     * Computes a measure of the used capacity. Delegates to subclasses for specific implementations, default is the
     * length of the items array.
     *
     * @returns {Number} - Currently used capacity
     * @private
     */
    _usedCapacity()
    {
        return this.items.length;
    }
}
