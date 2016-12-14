class CustomerController extends OrderController
{
    view()
    {
        this._loadTemplate(
            "src/views/template/customer/customer.html",
            "#customers",
            {}
        );
    }

    registerEvent(id)
    {
        let closure = function (func) {
            let customer = GAME.model.customers.filter((customer) => customer.id == id).shift();
            let customerController = new CustomerController();

            func(customer, customerController);
        };

        $("button[data-customer="+ id +"].customer-serve").click(function (e) {
            closure(function (customer, controller) {
                if (controller.validateOrder(customer.order)) {
                    controller.completeOrder(customer);

                    $(this).off(e);
                } else {
                    toastr.warning(Controller.l("You don't have all the products to complete this order."))
                }
            });
        });

        $("button[data-customer="+ id +"].customer-send-away").click(function (e) {
            closure(function (customer, controller) {
                controller.sendAway(customer);
            });
        });
    }

    generateOrder()
    {
        var protoOrder = GAME.model.products.map(
            prod => {
                return {
                    name: prod.name,
                    value: super.randomDemandGenerator(
                        prod.demand.mean,
                        prod.demand.variance
                    )
                }
            }
        );

        var products = OrderController._makeOrder(protoOrder);
        var customer = new Customer(products);

        customer.id = Math.max(...GAME.model.customers.map(customer => customer.id + 1), 0);
        GAME.model.customers.push(customer);

        this._updateOrderView(customer);

        toastr.info(Controller.l("New customer is waiting!"));
    }

    completeOrder(customer)
    {
        this._updateMoney(customer.order.orderCost());

        let warehouseController = new WarehouseController();

        warehouseController.orderUpdateWarehouse(customer.order);
        warehouseController.updateContainerView();
        warehouseController.updateCapacityView();

        GAME.model.customers = GAME.model.customers.filter((item) => customer.id != item.id);

        this._updateCustomerView();
    }

    /**
     * Removes customer from the customer array.
     * @param customer
     */
    sendAway(customer)
    {
        // TODO Log event in history

        GAME.model.customers = GAME.model.customers.filter((item) => customer.id != item.id);
        this._updateCustomerView();

        if (GAME.model.config.penaltySendingCustomerAway) {
            this._updateMoney(-GAME.model.config.penaltySendingCustomerAway);
            toastr.warning(Controller.l("You got a penalty for sending the customer away."));
        }
    }

    /**
     * Validates order if quantity in warehouse for every product is
     * larger than in order.
     */
    validateOrder(order)
    {
        let callback = (sum, elem) => sum + elem;

        return order.products.every(function (product) {
            let quantity = GAME.model.warehouse.items.map(function (container) {
                return container.items.map(function (item) {
                    return product.name == item.name ? item.values.quantity : 0;
                }).reduce(callback, 0);
            }).reduce(callback, 0);

            return quantity >= product.values.quantity;
        });
    }

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
        this._loadTemplate(
            "src/views/template/customer/customerorder.html",
            "#customer-orders",
            customer,
            true
        ).done(() => this.registerEvent(customer.id));
    }
}
