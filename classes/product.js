class Product
{
    /**
     * @constructor Represents a product.
     *
     * @param {string} name - The display name for this product.
     * @param {int} quantity - The amount of this product
     * @param {int} perishable - The number of days a perishable good remains fresh. 0 for infinite.
     */
    constructor(name, quantity, perishable = 0)
    {
        this.name = String(name);
        this.quantity = parseInt(quantity);
        this.perishable = parseInt(perishable);
    }

    /**
     * Used to update the quantity on this product.
     *
     * @param {int} ordered - The amount ordered, to be deducted from this Product quantity.
     * @throws Error when insufficient stock (ordered > quantity available).
     */
    updateQuantity(ordered)
    {
        ord = parseInt(ordered);

        if (ord > this.quantity) {
            throw new Error(
                "Insufficient stock on " + this.name + "! Ordered: " + ord + ", available: " + this.quantity
            );
        } else {
            this.quantity = this.quantity - ord;
        }
    }

    toString()
    {
        return "I am a Product, specifically a " + this.name + "; Currently I still have " + this.quantity
            + " in stock, and I will remain fresh for another " + this.perishable + " days.";
    }
}
