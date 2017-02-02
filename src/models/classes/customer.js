class Customer
 {
     /**
      * @constructor Represents a Customer
      *
      * @param products
      */
    constructor(products, id)
    {
        this.name = this.generateName();
        this.order = new CustomerOrder(products);
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
 }
