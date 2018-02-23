import OrderController from './core/ordercontroller';
import Controller from './core/controller';
import WarehouseController from './warehousecontroller';
import MoneyController from './moneycontroller';

import FactoryOrder from '../models/classes/factoryorder';


export default class FactoryController extends OrderController
{
    view()
    {
        const products = GAME.model.factory.groupByProductType();

        this._loadTemplate(
            "src/views/template/factory/factory.html",
            "#factory",
            Object.keys(products)
        ).done(() => {
            this._factoryFormInputView(products);

            this.registerEvent();
            this._setActiveTab();

            $('[data-toggle="tooltip"]').tooltip();
        });
    }

    /**
     * @augments Controller.registerEvent
     */
    registerEvent()
    {
        const $handle = $("form[name=newFactoryOrder]");

        // form submission, creates an order
        $handle.submit(
            (e) => {
                e.preventDefault();

                if (this.factoryOrder($handle.serializeArray())) {
                    $handle.trigger("reset");
                }
            }
        );

        //adds an extra truck after cost validation
        $("#buy-truck").click(() => {
            if (GAME.model.config.money >= GAME.model.config.costExtraTruck) {
                MoneyController.updateMoney(-GAME.model.config.costExtraTruck);
                GAME.model.config.maxSimultaneousOrders++;

                GAME.model.message.success(Controller.l("You purchased an extra truck!"));
            } else {
                GAME.model.message.warning(Controller.l("You cannot afford an extra truck!"));
            }
        });

        // reset all values to zero after order
        $handle.on('reset', function () {
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
        const products = OrderController._makeOrder(formValues);
        const order = new FactoryOrder(
            products,
            Math.max(...GAME.model.orders.map(order => order.id + 1), 0),
            GAME.model.config.orderTransportDurationDays
        );
        const orderValidation = this.validateOrder(order);

        if (orderValidation) {
            GAME.model.orders.push(order);

            MoneyController.updateMoney(-order.orderCost());
            this._updateOrderView(order);

            GAME.model.message.success(Controller.l("Order has been placed!"));
        }

        return orderValidation;
    }

    validateOrder(order)
    {
        const products = order.products;
        const orderSize = products.reduce((sum, prod) => sum + prod.shelfSize(), 0);
        const orderCost = products.reduce((sum, prod) => sum + prod.stockValue(), 0);

        if (!products.length) {
            GAME.model.message.warning(Controller.l("An order cannot be empty."));
            return false;
        }

        if (GAME.model.orders.length == GAME.model.config.maxSimultaneousOrders) {
            GAME.model.message.error(Controller.l("There is no room for another order at this time!"));
            return false;
        }

        if (orderSize > GAME.model.config.orderCapacity) {
            GAME.model.message.error(Controller.l("There is insufficient space on the truck!"));
            return false;
        }

        if (orderCost > GAME.model.config.money) {
            GAME.model.message.error(Controller.l("You cannot afford this!"));
            return false;
        }

        if (products.some((product) => product.values.quantity < 0)) {
            GAME.model.message.error(Controller.l("You cannot order a negative amount!"));
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

                        $("#factory-order-cost").html(products.reduce((sum, prod) => sum + prod.stockValue(), 0).toFixed(2));
                        $("#factory-order-capacity").html(products.reduce((sum, prod) => sum + prod.shelfSize(), 0));
                    }
                );

                // Increases the value in the input by the given amount
                // TODO after first level is reached, the first button gets an active class
                // causing the button to look not like the others
                $(".add-quantity-to-order").children().click(function () {
                    const increaseBy = $(this).data('amount');

                    $(this).parent().parent().find('input').val(function (i, oldval) {
                        return parseInt(oldval) + parseInt(increaseBy);
                    });

                    $("form[name=newFactoryOrder] :input").trigger('change');
                });
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
    _updateFactory()
    {
        GAME.model.factory.products = GAME.model.base.products.filter(product => {
            return product.level <= GAME.model.config.level;
        });

        this.view();
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
