class Warehouse extends Storage
{
    /**
     * @param {Container} container - The container to be added.
     * @throws Error when the extra Container would exceed Warehouse capacity!
     *
     * @override
     */
    addItem(container)
    {
        if (!container instanceof Container) {
            throw new TypeError("Expected a Container, but got a " + container.constructor.name);
        }

        super.addItem(container);
    }

    toString()
    {
        return "I am a Warehouse; currently I have " + this._usedCapacity() + " Containers, out of a maximum of "
            + this.capacity;
    }
}
