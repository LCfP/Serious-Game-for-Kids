class ProductCore
{
    /**
     * @constructor Represents a product.
     *
     * @param {string} name - The display name for this product.
     * @param {int} quantity - The amount of this product
     * @param {float} size - A unitless measure for the size of a product (qty = 1).
     * @param {boolean} isPerishable=false - Is this good considered perishable?
     * @param {int} perishable=0 - The number of days a perishable good remains fresh. In conjunction with isPerishable.
     */
    constructor(name, quantity, size, isPerishable = false, perishable = 0)
    {
        this.name = String(name);
        this.quantity = parseInt(quantity);
        this.size = parseFloat(size);
        this.isPerishable = Boolean(isPerishable);
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
}
