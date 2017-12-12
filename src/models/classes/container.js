import StorageCore from './core/storagecore';
import Product from './product';


export default class Container extends StorageCore
{
    /**
     * @param {Product} product - The product to be added.
     *
     * @override
     */
    addItem(product)
    {
        const availableCapacity = this.capacity - this.usedCapacity();

        if (availableCapacity < product.values.size) {
            return product.values.quantity;
        }

        const partialProduct = new Product(product.name, $.extend({}, product.values));
        const addedQuantity = Math.min(
            product.values.quantity,
            parseInt(availableCapacity / product.values.size)
        );

        partialProduct.values.quantity = addedQuantity;
        product.values.quantity = product.values.quantity - addedQuantity;

        this.items.push(partialProduct);

        return product.values.quantity;
    }

    /**
     * @param {Product} product - the product to be removed.
     *
     * @override
     */
    removeItem(product)
    {
        // Maken an array of the perish time and corresponding product name, which can be compared later.
        let perishTimeArray = [];
        let perishNameArray = [];
        let perishDuplicates = {};
        for (let i = 0; i < this.items.length; i++) {

           if (this.items[i].values.isPerishable) {

               perishTimeArray.push(this.items[i].values.perishable);
               perishNameArray.push(this.items[i].name);
           }
        }

        // https://stackoverflow.com/a/18417854
        // Creates an object with the duplicate name,
        // and their index in the original array.

        Array.prototype.getDuplicates = function () {
            let duplicates = {};
            for (var i = 0; i < this.length; i++) {
                if(duplicates.hasOwnProperty(this[i])) {

                    duplicates[this[i]].push(i);
                } else if (this.lastIndexOf(this[i]) !== i) {

                    duplicates[this[i]] = [i];
                }
                perishDuplicates = duplicates;
            }
        }

        perishNameArray.getDuplicates();
        

        // Idea: compare the perish values of the duplicate products,
        // filter out the 'most perished' products,
        // or with the lowest perishTime.

        this.items = this.items.filter(function (item) {
            if (product.name != item.name) {
                return item;
            }

            const removedQuantity = Math.min(product.values.quantity, item.values.quantity);

            product.values.quantity -= removedQuantity;
            item.values.quantity -= removedQuantity;

            return item.values.quantity;
        });

        return product.values.quantity;
    }

    /**
     * Updates perishable products whenever the next day occurs.
     *
     * @augments StorageCore.updatePerishableProducts()
     */
    updatePerishableProducts()
    {
        this.items = this.items.filter(
            function (product) {
                if (typeof product == "undefined") {
                    return false;
                }

                const initPerishable = GAME.model.base.products
                    .filter((prod) => prod.name == product.name)
                    .shift().values.perishable - 1;

                product.values.perishable = product.values.perishable - 1;
                product.values.percentage = 100 * product.values.perishable / initPerishable;

                // empty container does not have defined products. Else: product needs to be perishable,
                // and needs to have perished.
                return !(product.values.isPerishable && product.values.perishable <= 0)
            }
        );
    }

    /**
     * @override
     */
    usedCapacity(asPercentage = false)
    {
        const usedCap = this.items.reduce((sum, prod) => sum + prod.shelfSize(), 0);
        return asPercentage ? 100 * (usedCap / this.capacity) : usedCap;
    }

    toString()
    {
        return "I am a Container, specifically a " + this.name + "; Currently I have used " + this.usedCapacity()
            + " out of a total capacity of " + this.capacity + ", and I have " + this.items.length
            + " Products in storage.";
    }
}
