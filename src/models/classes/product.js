import ProductCore from './core/productcore';


export default class Product extends ProductCore
{
    toString()
    {
        return "I am a Product, specifically a " + this.name + "; Currently I still have " + this.values.quantity
            + " in stock, and I will remain fresh for another " + this.values.perishable + " days. My unit size is "
            + this.values.size + ".";
    }
}
