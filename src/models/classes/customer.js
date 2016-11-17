 class Customer
 {
     /**
      * @constructor Represents a Customer
      *
      * @param products
      */
    constructor(products)
    {
        this.name = this.generateName();
        this.products = products;
        this.orderCost = this.orderCost();
    }

     /**
      * Generates a random name for the customer
      * TODO: make name generation random
      *
      * @returns {string}
      */
    generateName()
    {
        return String('Henk');
    }

     /**
      * Calculates order cost
      *
      * @returns {Number}
      */
    orderCost()
    {
        return parseFloat(this.products.reduce((sum, prod) => sum + prod.value(), 0));
    }
 }