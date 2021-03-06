import Controller from './core/controller';
import MoneyController from './moneycontroller';
import Container from '../models/classes/container';
import OrderProcessController from './orderprocesscontroller';


export default class WarehouseController extends Controller
{
    view()
    {
        this._warehouseHelper();
        this._containerHelper();
    }

    /**
     * @see Storage.updatePerishableProducts
     */
    updatePerishableProducts()
    {
        GAME.model.warehouse.updatePerishableProducts();
    }

    /**
     * Updates holding cost, every time it is invoked. See the config for the current parameter values,
     * used in formula: quantity * product size * holdingCostPerSize.
     *
     * @deprecated since v1.1.1
     *
     * Holding costs were introduced to the game in v1.0, but after playing with some groups of kids,
     * we decided they were too complicated to have in the game. As such, per v1.1.1, they were removed
     * from execution.
     */
    updateHoldingCost()
    {
        const cost = GAME.model.base.products.reduce(function (sum, product) {
            let quantity = GAME.model.warehouse.getItemQuantity(product);
            return sum + quantity * product.values.size * GAME.model.config.holdingCostPerSize;
        }, 0);

        MoneyController.updateMoney(-cost);
    }

    /**
     * Helper method to refresh the containers.
     */
    updateContainerView()
    {
        $("#containers").empty();
        this._containerHelper();
    }

    updateCapacityView()
    {
        // text heading
        $("#warehouse-used-capacity").html(GAME.model.warehouse.usedContainerCapacity());
        $("#warehouse-max-capacity").html(GAME.model.warehouse.maxContainerCapacity());

        // progress bar
        $("#warehouse-progress-bar")
            .css({width: GAME.model.warehouse.usedContainerCapacity(true) + "%"})
            .attr("aria-valuenow", GAME.model.warehouse.usedContainerCapacity(true));
    }

    processFactoryOrder(order)
    {
        const orderSize = order.products.reduce((sum, prod) => sum + prod.shelfSize(), 0);
        const availableCapacity = GAME.model.warehouse.maxContainerCapacity() - GAME.model.warehouse.usedContainerCapacity();

        if (orderSize > availableCapacity)
            return GAME.model.message.error(Controller.l("There is no room left for this order in the warehouse!"));

        (new OrderProcessController(order)).processOrder();
    }

    processCustomerOrder(order) {
        (new OrderProcessController(order)).processOrder();
    }

    /**
     * Helper method to display the warehouse
     *
     * @private
     */
    _warehouseHelper()
    {
        this._loadTemplate(
            "src/views/template/warehouse/warehouse.html",
            "#warehouse",
            GAME.model.warehouse
        );
    }

    /**
     * Helper method to fill the warehouse view with containers.
     *
     * @private
     */
    _containerHelper()
    {
        GAME.model.warehouse.items.forEach(
            (container) => {
                // group by size, for the image icons
                container.itemsBySize = this._containerDivideProductsBySize(container);

                // for the progress bar
                container.percentage = container.usedCapacity(true);

                super._loadTemplate(
                    "src/views/template/container/container.html",
                    "#containers",
                    container,
                    true
                );
            }
        );

        this._renderPurchaseContainer();
    }

    /**
     * Helper method for rendering another not-yet-purchased container. Allows for increasing the size of the
     * warehouse.
     *
     * @private
     */
    _renderPurchaseContainer()
    {
        // no more containers may be purchased, so remove that option from the game.
        if (GAME.model.warehouse.items.length >= GAME.model.config.warehouseCapacity) {
            return $("#purchase-container-area").remove();
        }

        const event = () => {
            $("#purchase-container").click(() => {
                if (GAME.model.config.money > GAME.model.config.addContainerCost) {
                    GAME.model.warehouse.addItem(
                        new Container(
                            "Rack",
                            GAME.model.config.containerCapacity
                        )
                    );

                    MoneyController.updateMoney(-GAME.model.config.addContainerCost);
                    this.updateContainerView();
                    this.updateCapacityView();

                    GAME.model.message.success(Controller.l("Purchased an additional container!"));
                } else {
                    GAME.model.message.warning(Controller.l("You cannot afford this!"));
                }
            });
        };

        this._loadTemplate(
            "src/views/template/container/purchasecontainer.html",
            "#purchase-container-area",
            GAME.model.config
        ).done(event);
    }

    /**
     * Divides the container products into image blocks, so each items can be represented
     * as an icon (per `iconPerAmountProductSize` size).
     *
     * @private
     */
    _containerDivideProductsBySize(container)
    {
        return container.items.map(function (item) {
            let amountIcons = Math.floor(item.shelfSize() / GAME.model.config.iconPerAmountProductSize);
            let remainder = item.shelfSize() % GAME.model.config.iconPerAmountProductSize;

            // list of [iconAmount, iconAmount, iconAmount, ..., remainder]
            let groupingAmount = new Array(amountIcons).fill(GAME.model.config.iconPerAmountProductSize);

            // This item's `shelfSize` may not be a multiple of `iconPerAmountProductSize`
            if (remainder) {
                groupingAmount.push(remainder);
            }

            // map into object and return
            return groupingAmount.map(function (size) {
                return {
                    "product" : item,
                    "color" : this._percentageColorIndication(item.values.percentage || 100),
                    // this grouping's size, divided by unit product size = quantity
                    "quantity": Math.floor(size / item.values.size)
                }
            }, this);
        }, this).reduce(function(self, other){
            return self.concat(other);
        }, []);
    }

    /**
     * Maps the product perishability (as a percentage of initial) to a color code.
     * TODO: think about how these ranges should be, and proper colours (css).
     *
     * @private
     */
    _percentageColorIndication(percentage)
    {
        let indicators = ["red", "yellow", "green"]; // these are css colours, not just 'names'
        let n = indicators.length;

        return indicators[Math.min(Math.floor(percentage * (n / 100)), n - 1)];
    }
}
