import OrderController from './core/ordercontroller';
import Controller from './core/controller';
import MoneyController from './moneycontroller';
import WarehouseController from './warehousecontroller';
import DemandController from './demandcontroller';

import Customer from '../models/classes/customer';
import CustomerOrder from '../models/classes/customerorder';


export default class CustomerController extends OrderController
{
    view()
    {
        this._loadTemplate(
            "src/views/template/customer/customer.html",
            "#customers",
            GAME.model.customers
        );
    }

    registerEvent(id)
    {
        $("button[data-customer="+ id +"].customer-serve").click(function (e) {
            closure(function (customer, controller) {
                if (controller.validateOrder(customer.order)) {
                    controller.completeOrder(customer);
                } else {
                    GAME.model.message.warning(Controller.l("You don't have all the products to complete this order."))
                }
            });

            $(this).off(e);
        });

        $("button[data-customer="+ id +"].customer-send-away").click(function (e) {
            closure(function (customer, controller) {
                controller.sendAway(customer);
            });

            $(this).off(e);
        });

        const closure = function (fn) {
            let customer = GAME.model.customers.filter((customer) => customer.id == id).shift();
            let customerController = new CustomerController();

            fn(customer, customerController);
            customerController._updateCustomerView();
        };
    }

    /**
     * Updates satisfaction of customers each time a new day occurs.
     */
    updateSatisfaction()
    {
        GAME.model.customers.forEach(function(customer)
        {
            customer.customer.satisfaction -= 10;

            if (customer.customer.satisfaction <= 20)
                this.sendAway(customer);
            if (customer.customer.satisfaction < 50)
                return console.log("This customer's satisfaction is below 50, namely" + customer.customer.satisfaction);
            if (customer.customer.satisfaction < 70)
                return console.log("This customer's satisfaction is below 70, namely " + customer.customer.satisfaction);
            //else
                //happyface


        });
    }

    generateOrder(isStructural = false)
    {
        const demandGenerator = new DemandController();

        const availableProducts = GAME.model.base.products.filter(product => {
            return product.level <= GAME.model.config.level;
        });

        const protoOrder = availableProducts.map(
            prod => {
                return {
                    name: prod.name,
                    value: demandGenerator.randomDemandGenerator(prod.demand)
                }
            }
        );

        const customer = new Customer(
            GAME.model.config.hours,
            OrderController._makeOrder(protoOrder),
            Math.max(...GAME.model.customers.map(customer => customer.id + 1), 0),
            isStructural
        );

        if (customer.order.products.length) {
            GAME.model.customers.push(customer);
            this._updateOrderView(customer);

            GAME.model.message.info(Controller.l("New customer is waiting!"));
        }
    }

    /**
     * @augments OrderController.completeOrder
     *
     * @param {Customer} customer
     */
    completeOrder(customer)
    {
        MoneyController.updateMoney(customer.order.orderCost());

        const warehouseController = new WarehouseController();
        const orderCopy = new CustomerOrder(OrderController._copyOrder(customer.order));

        if (warehouseController.processCustomerOrder(orderCopy)) {
            super.completeOrder(customer);
        }

        warehouseController.updateContainerView();
        warehouseController.updateCapacityView();

        GAME.model.customers = GAME.model.customers.filter((item) => customer.id != item.id);
    }

    /**
     * Removes customer from the customer array.
     *
     * @param {Customer} customer
     */
    sendAway(customer)
    {
        // TODO Log event in history
        GAME.model.customers = GAME.model.customers.filter((item) => customer.id != item.id);

        if (GAME.model.config.penaltySendingCustomerAway) {
            MoneyController.updateMoney(-GAME.model.config.penaltySendingCustomerAway);
            GAME.model.message.warning(Controller.l("You got a penalty for sending the customer away."));
        }
    }

    /**
     * Validates order if quantity in warehouse for every product is
     * larger than in order.
     *
     * @return {boolean}
     */
    validateOrder(order)
    {
        return order.products.every(function (product) {
            const quantity = GAME.model.warehouse.getItemQuantity(product);
            return quantity >= product.values.quantity;
        });
    }

    /**
     * @private
     */
    _updateCustomerView()
    {
        $("#customer-orders").empty();

        GAME.model.customers.forEach(function (customer) {
            this._updateOrderView(customer);
        }, this);
    }

    /**
     * @private
     */
    _updateOrderView(customer)
    {
        if (GAME.model.customers.length) {
            $(".no-customers").remove();
        }

        this._loadTemplate(
            "src/views/template/customer/customerorder.html",
            "#customer-orders",
            customer,
            true
        ).done(() => this.registerEvent(customer.id));
    }
}
