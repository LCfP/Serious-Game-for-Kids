class CustomerController extends OrderController
{
    view()
    {
        this._loadTemplate(
            "src/views/template/customer.html",
            "#customers",
            {}
        ).done(() => this.registerEvent());
    }

    registerEvent()
    {
        $(document).on('click', '.customer-complete', function(e) {
            e.preventDefault();

            var id = $(this).closest("div[data-customer]").data('customer');

            var customer = GAME.model.customers.filter(function (customer) {
                return customer.id == id;
            })[0];

            let customerController = new CustomerController();
            customerController.completeOrder(customer);
        });
    }

    generateOrder()
    {
        if (super.normalDistribution() < 1.725) {
            return;
        }

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
        var warehousecontroller = new WarehouseController();

        customer.order.products.forEach(function (product) {
            warehousecontroller.removeProduct(product, customer);
        });

        warehousecontroller.updateContainerView();

        // TODO add to history
        GAME.model.customers = GAME.model.customers.filter(function (e) {
            return e.id != customer.id;
        });

        this._reloadCustomerView();

        return;
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
            "src/views/template/customerorder.html",
            "#customer-orders",
            customer,
            true
        );
    }
}
