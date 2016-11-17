class CustomerController extends Controller
{
    view()
    {
        this._customerHelper();
    }

    generateOrder()
    {
        var products = this.constructor._makeOrder();

        var orderCost = products.reduce((sum, prod) => sum + prod.value(), 0);

        var customer = {
            name: 'Henk', // Find way to generate names
            products: products,
            orderCost: orderCost
        };

        MODEL.customers.push(customer);

        this._updateOrderView(customer);

        toastr.info("New customer is waiting!");
    }

    static registerEvent()
    {
        //
    }

    _updateOrderView(customer)
    {
        $.get(
            "src/views/template/customerorder.html",
            function (customerOrdersView) {
                var template = Mustache.render(customerOrdersView, customer);
                $("#customer-orders").append(template);
            }
        );
    }

    _customerHelper()
    {
        $.get(
            "src/views/template/customer.html",
            function (customerView)
            {
                var template = Mustache.render(customerView, null);
                $("#customers").html(template);
            }
        );
    }

    static _makeOrder()
    {
        return MODEL.products.map(function (product) {

            return new Product(
                product.name,
                Math.floor(Math.random() * 6),
                product.price,
                product.size,
                product.isPerishable,
                product.perishable
            );

        });
    }
}
