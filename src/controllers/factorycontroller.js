class FactoryController extends OrderController
{
    view()
    {
        this._loadTemplate(
            "src/views/template/factory.html",
            "#factory",
            MODEL.factory
        );

        FactoryController.registerEvent();
    }

    /**
     * Handles ordering a set of products from the factory
     *
     * @param {Array} formValues - The ordered products, as an array of {name, quantity} objects.
     */
    factoryOrder(formValues)
    {
        var products = OrderController._makeOrder(formValues);

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
                var products = OrderController._makeOrder(formValues);

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
        this._loadTemplate(
            "src/views/template/factoryorder.html",
            "#factory-orders",
            order,
            true
        );
    }
}
