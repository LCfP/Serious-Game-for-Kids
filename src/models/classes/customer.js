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
        this.order = new CustomerOrder(products);
        this.timestamp = GAME.model.config.hour;

        this.id = Math.max(...GAME.model.customers.map(customer => customer.id + 1), 0);
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
