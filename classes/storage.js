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
     * @override
     */
    _usedCapacity()
    {
        return this.items.length;
    }

    toString()
    {
        return "I am a Storage; currently I have " + this._usedCapacity() + " Containers, out of a maximum of "
            + this.capacity;
    }
}
