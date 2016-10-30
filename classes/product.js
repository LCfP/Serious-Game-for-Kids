class Product extends ProductCore
{
    toString()
    {
        return "I am a Product, specifically a " + this.name + "; Currently I still have " + this.quantity
            + " in stock, and I will remain fresh for another " + this.perishable + " days. My unit size is "
            + this.size + ".";
    }
}
