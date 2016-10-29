class Product
{
    /**
     * @constructor Represents a product.
     *
     * @param {string} name - The display name for this product.
     * @param {int} quantity - The amount of this product
     * @param {float} size - A unitless measure for the size of a product (qty = 1).
     * @param {int=0} perishable - The number of days a perishable good remains fresh. 0 for infinite.
     */
    constructor(name, quantity, size, perishable = 0)
    {
        this.name = String(name);
        this.quantity = parseInt(quantity);
        this.size = parseFloat(size);
        this.perishable = parseInt(perishable);
    }

    /**
     * Used to decrease the quantity on this product.
     *
     * @param {int} ordered - The amount ordered, to be deducted from this Product quantity.
     * @throws Error when insufficient stock (ordered > quantity available).
     */
    decreaseQuantity(ordered)
    {
        var ord = parseInt(ordered);

        if (ord > this.quantity) {
            throw new Error(
                "Insufficient stock on " + this.name + "! Ordered: " + ord + ", available: " + this.quantity
            );
        }

        this.quantity = this.quantity - ord;
    }

    /**
     * Calculates shelf size, as the total quantity times the unit size.
     */
    shelfSize()
    {
        return this.size * this.quantity;
    }

    toString()
    {
        return "I am a Product, specifically a " + this.name + "; Currently I still have " + this.quantity
            + " in stock, and I will remain fresh for another " + this.perishable + " days. My unit size is "
            + this.size + ".";
    }
}
