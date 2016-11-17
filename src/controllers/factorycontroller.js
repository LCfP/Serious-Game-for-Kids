class FactoryController extends Controller
{
    view()
    {
        this._factoryHelper();
    }

    /**
     * Handles ordering a set of products from the factory
     *
     * @param {Array} formValues - The ordered products, as an array of {name, quantity} objects.
     */
    factoryOrder(formValues)
    {
        var products = this._makeOrder(formValues);

        var orderSize = products.reduce((sum, prod) => sum + prod.shelfSize(), 0);
        var orderCost = products.reduce((sum, prod) => sum + prod.value(), 0);

        // must be room for another order, there should be space on the truck, and money to pay for the order
        var flag = orderSize <= MODEL.config.orderCapacity && orderCost <= MODEL.config.money
            && MODEL.orders.length < MODEL.config.maxSimultaneousOrders;

        if (flag) {
            this._updateMoney(-orderCost);

            var order = {
                products: products,
                time: MODEL.config.orderTransportDuration
            };

            MODEL.orders.push(order);

            this._updateOrderView(order);
            toastr.success("Order has been placed!");
        } else {
            toastr.error("Order could not be placed!")
        }
    }

    /**
     * @augments Controller.registerEvent
     */
    static registerEvent()
    {
        // form submission, creates an order
        $("form[name=newFactoryOrder]").submit(
            function (e) {
                e.preventDefault();

                var controller = new FactoryController();
                controller.factoryOrder($(this).serializeArray());

                $('#new-order-modal').modal('toggle');
            }
        );

        // updates the information for the current order process
        $("form[name=newFactoryOrder] :input").change(
            function (e) {
                var formValues = $("form[name=newFactoryOrder]").serializeArray();
                var products = FactoryController._makeOrder(formValues);

                $("#factory-order-cost").html(products.reduce((sum, prod) => sum + prod.value(), 0));
                $("#factory-order-capacity").html(products.reduce((sum, prod) => sum + prod.shelfSize(), 0));
            }
        );
    }

    /**
     * @private
     */
    _updateOrderView(order)
    {
        $.get(
            "src/views/template/factoryorder.html",
            function (progressBarView) {
                var template = Mustache.render(progressBarView, order);
                $("#factory-orders").append(template);
            }
        )
    }

    /**
     * Helper method to fill the warehouse view with containers.
     *
     * @private
     */
    _factoryHelper()
    {
        $.get(
            "src/views/template/factory.html",
            function (factoryView)
            {
                var template = Mustache.render(factoryView, MODEL.factory);
                $("#factory").html(template);

                FactoryController.registerEvent();
            }
        );
    }

    /**
     * Turns the values from the form into a proper Array of ordered products
     *
     * @param {Array} order - Array of values from the newFactoryOrder form
     * @returns {Array} products - Array of ordered products
     *
     * @private
     */
    static _makeOrder(order)
    {
        return order.map(function (ordered) {
            if (!ordered.value) {
                return false
            }

            var protoProduct = MODEL.products.filter((prod) => prod.name == ordered.name).shift();

            return new Product(
                ordered.name,
                ordered.value,
                protoProduct.price,
                protoProduct.size,
                protoProduct.isPerishable,
                protoProduct.perishable
            );
        }).filter(Boolean); // see http://stackoverflow.com/a/34481744/4316405
    }
}
