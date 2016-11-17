class CustomerController extends OrderController
{
    view()
    {
        this._loadTemplate(
            "src/views/template/customer.html",
            "#customers",
            // TODO: there must be something more to display here, perhaps also make a customer class?
            null
        );
    }

    generateOrder()
    {
        var protoOrder = MODEL.products.map(
            prod => {
                return {
                    name: prod.name,
                    value: super.randomDemandGenerator()
                }
            }
        );

        var products = super._makeOrder(protoOrder);
        var orderCost = products.reduce((sum, prod) => sum + prod.value(), 0);
        var customer = {
            name: 'Henk', // TODO randomly generate names
            products: products,
            orderCost: orderCost
        };

        MODEL.customers.push(customer);
        this._updateOrderView(customer);

        toastr.info("New customer is waiting!");
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
