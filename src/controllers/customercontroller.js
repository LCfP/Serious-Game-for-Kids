class CustomerController extends OrderController
{
    view()
    {
        this._loadTemplate(
            "src/views/template/customer.html",
            "#customers",
            {}
        );
    }

    generateOrder()
    {
        var protoOrder = GAME.model.products.map(
            prod => {
                return {
                    name: prod.name,
                    value: super.randomDemandGenerator()
                }
            }
        );

        var products = OrderController._makeOrder(protoOrder);
        var customer = new Customer(products);

        GAME.model.customers.push(customer);
        this._updateOrderView(customer);

        toastr.info(Controller.l("New customer is waiting!"));
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
