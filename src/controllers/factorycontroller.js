class FactoryController extends OrderController
{
    view()
    {
        this._loadTemplate(
            "src/views/template/factory.html",
            "#factory",
            GAME.model.factory
        ).done(() =>  this.registerEvent());
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
            this._updateMoney(-order.orderCost);

            GAME.model.orders.push(order);
            this._updateOrderView(order);

            toastr.success(Controller.l("Order has been placed!"));
        }
    }

    validateOrder(order)
    {
        var products = order.products;

        if (!products.length) {
            toastr.warning(Controller.l("An order cannot be empty."));
        }

        if (GAME.model.orders.length == GAME.model.config.maxSimultaneousOrders) {
            toastr.error(Controller.l("There is no room for another order at this time!"));
        }

        var orderSize = products.reduce((sum, prod) => sum + prod.shelfSize(), 0);
        var orderCost = products.reduce((sum, prod) => sum + prod.value(), 0);

        if (orderSize > GAME.model.config.orderCapacity) {
            toastr.error(Controller.l("There is insufficient space on the truck!"));
        }

        if (orderCost > GAME.model.config.money) {
            toastr.error(Controller.l("You cannot afford this!"));
        }

        if (products.some((elem) => elem.quantity < 0)) {
            toastr.error(Controller.l("You cannot order a negative amount!"));
            return false;
        }

        // TODO check warehouse capacity
        // TODO in need of refactoring

        return products.length && orderSize <= GAME.model.config.orderCapacity
            && orderCost <= GAME.model.config.money && GAME.model.orders.length < GAME.model.config.maxSimultaneousOrders;
    }

    /**
     * Updates order counter, at every daily interval. When 0, adds to Warehouse.
     */
    static updateOrderDaily()
    {
        var $handle = $(".days-countdown.factory-order");

        if ($handle) {
            $handle.each(
                function (i, elem) {
                    var time = $(this).html() - 1;

                    if (!time) {
                        var id = $($(this).siblings(".factory-order.order-id")[0]).html();

                        var order = GAME.model.orders.filter(
                            function (order) {
                                return order.id == id;
                            }
                        )[0];

                        var warehouseController = new WarehouseController();
                        warehouseController.addOrder(order);

                        $(this).parents(".panel.panel-default").remove();
                    } else {
                        $(this).html(time);
                    }
                }
            );

            GAME.model.orders = GAME.model.orders.filter(
                function (order) {
                    order.time = order.time - 1;

                    return order.time;
                }
            );
        }
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
