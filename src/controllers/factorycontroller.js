class FactoryController extends OrderController
{
    view()
    {
        this._loadTemplate(
            "src/views/template/factory.html",
            "#factory",
            GAME.model.factory
        ).done(() =>  {
            this._createRangeSliders();
            this.registerEvent();
        });
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

                $("#factory-order-cost").html(products.reduce((sum, prod) => sum + prod.stockValue(), 0));
                $("#factory-order-capacity").html(products.reduce((sum, prod) => sum + prod.shelfSize(), 0));
            }
        );
    }

    /**
     * Handles ordering a set of products from the factory
     *
     * @param {Array} formValues - The ordered products, as an array of {name, quantity} objects.
     */
    factoryOrder(formValues)
    {
        var products = OrderController._makeOrder(formValues);
        var order = new FactoryOrder(products);

        if (this.validateOrder(order)) {
            this._updateMoney(-order.orderCost());

            GAME.model.orders.push(order);
            this._updateOrderView(order);

            toastr.success(Controller.l("Order has been placed!"));
        }
    }

    validateOrder(order)
    {
        var products = order.products;
        var orderSize = products.reduce((sum, prod) => sum + prod.shelfSize(), 0);
        var orderCost = products.reduce((sum, prod) => sum + prod.stockValue(), 0);

        if (!products.length) {
            toastr.warning(Controller.l("An order cannot be empty."));
            return false;
        }

        if (GAME.model.orders.length == GAME.model.config.maxSimultaneousOrders) {
            toastr.error(Controller.l("There is no room for another order at this time!"));
            return false;
        }

        if (orderSize > GAME.model.config.orderCapacity) {
            toastr.error(Controller.l("There is insufficient space on the truck!"));
            return false;
        }

        if (orderCost > GAME.model.config.money) {
            toastr.error(Controller.l("You cannot afford this!"));
            return false;
        }

        if (products.some((product) => product.values.quantity < 0)) {
            toastr.error(Controller.l("You cannot order a negative amount!"));
            return false;
        }

        // TODO check warehouse capacity
        return true;
    }

    /**
     * Updates order counter, at every daily interval. When 0, adds to Warehouse.
     */
    static updateOrder()
    {
        let $handle = $(".factory-order");

        if (!$handle) {
            return;
        }

        $handle.each(function (elem) {
            let order = GAME.model.orders[elem];
            order.time = order.time - 1;

            if (order.time) {
                let percentage = 100 * (1 - (order.time / order.initDuration));
                $(this).find('.order-progress-bar').css({width: percentage + "%"}).attr("aria-valuenow", percentage);
            } else {
                let warehouseController = new WarehouseController();
                warehouseController.addOrderToWarehouse(order);

                $(this).remove();
            }
        });

        GAME.model.orders = GAME.model.orders.filter((order) => order.time);
    }

    /**
     * Creates the factory order form sliders.
     *
     * @private
     */
    _createRangeSliders()
    {

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
