import OrderController from './core/ordercontroller';
import Controller from './core/controller';
import MoneyController from './moneycontroller';
import WarehouseController from './warehousecontroller';
import DemandController from './demandcontroller';
import SatisfactionController from './satisfactioncontroller';

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

        const closure = function (fn) {
            let customer = GAME.model.customers.filter((customer) => customer.id == id).shift();
            let customerController = new CustomerController();

            fn(customer, customerController);
            customerController.updateCustomerView();
        };
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

            this.updateOrderView(customer);
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
        const satisfactionController = new SatisfactionController();
        const orderCopy = new CustomerOrder(OrderController._copyOrder(customer.order));

        warehouseController.processCustomerOrder(orderCopy);
        warehouseController.updateContainerView();
        warehouseController.updateCapacityView();

        GAME.model.config.completedOrders += 1;
        satisfactionController.updatePlayerSatisfaction(customer);

        GAME.model.customers = GAME.model.customers.filter((item) => customer.id != item.id);
    }

    /**
     * Removes customer from the customer array.
     *
     * @param {Customer} customer
     */
    sendAway(customer)
    {
        GAME.model.customers = GAME.model.customers.filter((item) => customer.id != item.id);

        if (GAME.model.config.penaltySendingCustomerAway) {
            MoneyController.updateMoney(-GAME.model.config.penaltySendingCustomerAway);
            GAME.model.message.warning(Controller.l("You got a penalty for sending the customer away."));
        }
    }

    /**
     * @See customer.updateSatisfaction
     */
    updateSatisfaction()
    {
        GAME.model.customers.forEach(customer => customer.updateSatisfaction());
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

    updateCustomerView()
    {
        $("#customer-orders").empty();

        GAME.model.customers.forEach(function (customer) {
            this.updateOrderView(customer);
        }, this);
    }

    updateOrderView(customer)
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
