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
        // TODO make the click event so it does not need to be attached to the document
        $("button[data-customer="+ id +"]").click(function (e) {
            let customer = GAME.model.customers.filter((customer) => customer.id == id).shift();
            let customerController = new CustomerController();

            if (customerController._validateOrder(customer.order)) {
                customerController.completeOrder(customer);
                $(this).off(e);
            } else {
                toastr.warning(Controller.l("You don't have all the products to complete this order."))
            }
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

        customer.id = GAME.model.customers.length;
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

        this._reloadCustomerView();
    }

    /**
     * Validates order if quantity in warehouse for every product is
     * larger than in order.
     *
     * @private
     */
    _validateOrder(order)
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

    _reloadCustomerView()
    {
        $("#customer-orders").empty();

        GAME.model.customers.forEach((customer) => {
            this._updateOrderView(customer);
        });
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
