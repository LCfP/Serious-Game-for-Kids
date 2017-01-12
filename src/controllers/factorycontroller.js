class FactoryController extends OrderController
{
    view()
    {
        const products = GAME.model.factory.groupByProductType();

        this._loadTemplate(
            "src/views/template/factory/factory.html",
            "#factory",
            Object.keys(products)
        ).done(() => {
            this.registerEvent();
            this._setActiveTab();

            $("#order-transport-cost").html(GAME.model.config.orderTransportCost);
        });

        this._factoryFormInputView(products);
    }

    /**
     * @augments Controller.registerEvent
     */
    registerEvent()
    {
        const $handle = $("form[name=newFactoryOrder]");

        // form submission, creates an order
        $handle.submit(
            function (e) {
                e.preventDefault();

                const controller = new FactoryController();

                if (controller.factoryOrder($handle.serializeArray())) {
                    $handle.trigger("reset");
                }
            }
        );

        //adds an extra truck after cost validation
        $("#buy-truck").click(() => {
            if (GAME.model.config.money > GAME.model.config.costExtraTruck) {
                this._updateMoney(-GAME.model.config.costExtraTruck);
                GAME.model.config.maxSimultaneousOrders++;

                toastr.success(Controller.l("You purchased an extra truck!"));
            } else {
                toastr.warning(Controller.l("You cannot afford an extra truck!"));
            }
        });

        // updates the information for the current order process
        $("form[name=newFactoryOrder] :input").change(
            function (e) {
                let formValues = $("form[name=newFactoryOrder]").serializeArray();
                let products = OrderController._makeOrder(formValues);

                $("#factory-order-cost").html(products.reduce((sum, prod) => sum + prod.stockValue(), 0));
                $("#factory-order-capacity").html(products.reduce((sum, prod) => sum + prod.shelfSize(), 0));
            }
        );

        // reset all values to zero after order
        $handle.on('reset', function (e) {
            $("#factory-order-cost").html(0);
            $("#factory-order-capacity").html(0);
        });
    }

    /**
     * Handles ordering a set of products from the factory
     *
     * @param {Array} formValues - The ordered products, as an array of {name, quantity} objects.
     */
    factoryOrder(formValues)
    {
        let products = OrderController._makeOrder(formValues);
        let order = new FactoryOrder(products);

        if (this.validateOrder(order)) {
            GAME.model.orders.push(order);

            this._updateMoney(-order.orderCost() - GAME.model.config.orderTransportCost);
            this._updateOrderView(order);

            toastr.success(Controller.l("Order has been placed!"));

            return true;
        }

        return false;
    }

    validateOrder(order)
    {
        let products = order.products;
        let orderSize = products.reduce((sum, prod) => sum + prod.shelfSize(), 0);
        let orderCost = products.reduce((sum, prod) => sum + prod.stockValue(), 0)
            + GAME.model.config.orderTransportCost;

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

        $handle.each(function () {
            let order = GAME.model.orders.filter((order) => order.id === parseInt($(this).data('factory'))).shift();
            order.time = order.time - 1;

            if (order.time) {
                let percentage = 100 * (1 - (order.time / order.initDuration));
                $(this).find('.order-progress-bar').css({width: percentage + "%"}).attr("aria-valuenow", percentage);
            } else {
                (new FactoryController()).completeOrder(order);
                $(this).remove();
            }
        });

        GAME.model.orders = GAME.model.orders.filter((order) => order.time);
    }

    /**
     * @augments OrderController.completeOrder
     */
    completeOrder(order)
    {
        const warehouseController = new WarehouseController();
        const orderCopy = new FactoryOrder(OrderController._copyOrder(order));

        // process order..
        if (warehouseController.processFactoryOrder(order)) {
            super.completeOrder(orderCopy);
        }

        // ..and update views
        warehouseController.updateContainerView();
        warehouseController.updateCapacityView();
    }

    /**
     * @private
     */
    _factoryFormInputView(products)
    {
        Object.keys(products).forEach(function (type) {
            const data = {
                products: products[type],
                type: type
            };

            this._loadTemplate(
                "src/views/template/factory/forminput.html",
                "#" + type,
                data,
                true
            ).done(() => {
                // updates the information for the current order process
                $("form[name=newFactoryOrder] :input").change(
                    function (e) {
                        let formValues = $("form[name=newFactoryOrder]").serializeArray();
                        let products = OrderController._makeOrder(formValues);

                        $("#factory-order-cost").html(products.reduce((sum, prod) => sum + prod.stockValue(), 0));
                        $("#factory-order-capacity").html(products.reduce((sum, prod) => sum + prod.shelfSize(), 0));
                    }
                );
            });
        }, this);
    }

    /**
     * @private
     */
    _setActiveTab()
    {
        const $handle = $("form[name=newFactoryOrder]");

        $handle.find("li.text-capitalize").first().addClass("active");
        $handle.find("div.tab-content :first-child").addClass("active");
    }

    /**
     * @private
     */
    _updateOrderView(order)
    {
        this._loadTemplate(
            "src/views/template/factory/factoryorder.html",
            "#factory-orders",
            order,
            true
        );
    }
}
