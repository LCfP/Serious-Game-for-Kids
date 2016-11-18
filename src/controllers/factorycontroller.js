class FactoryController extends OrderController
{
    view()
    {
        this._loadTemplate(
            "src/views/template/factory.html",
            "#factory",
            MODEL.factory
        ).done(() =>  this.registerEvent());
    }

    /**
     * Handles ordering a set of products from the factory
     *
     * @param {Array} formValues - The ordered products, as an array of {name, quantity} objects.
     */
    factoryOrder(formValues)
    {
        var products = OrderController._makeOrder(formValues);

        if (this.validateOrder(products)) {
            this._updateMoney(-orderCost);

            var order = {
                products: products,
                time: MODEL.config.orderTransportDuration
            };

            MODEL.orders.push(order);

            this._updateOrderView(order);

            toastr.success("Order has been placed!");
        }
    }

    /**
     * @augments Controller.registerEvent
     */
    registerEvent()
    {
        // form submission, creates an order
        $("form[name=newFactoryOrder]").submit(
            function (e) {
                e.preventDefault();

                var controller = new FactoryController();
                controller.factoryOrder($(this).serializeArray());
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

    validateOrder(products)
    {
        if (!products.length) {
            toastr.warning(Controller.l("An order cannot be empty."));
        }

        if (MODEL.orders.length == MODEL.config.maxSimultaneousOrders) {
            toastr.error(Controller.l("There is no room for another order at this time!"));
        }

        var orderSize = products.reduce((sum, prod) => sum + prod.shelfSize(), 0);
        var orderCost = products.reduce((sum, prod) => sum + prod.value(), 0);

        if (orderSize > MODEL.config.orderCapacity) {
            toastr.error(Controller.l("There is insufficient space on the truck!"));
        }

        if (orderCost > MODEL.config.money) {
            toastr.error(Controller.l("You cannot afford this!"));
        }

        return products.length && orderSize <= MODEL.config.orderCapacity
            && orderCost <= MODEL.config.money && MODEL.orders.length < MODEL.config.maxSimultaneousOrders;
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
