class WarehouseController extends Controller
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
     * Adds the contents of an order to the Warehouse.
     *
     * @param {OrderCore} order - The Order object.
     */
    addOrderToWarehouse(order)
    {
        let capacity = order.products.reduce((sum, prod) => sum + prod.shelfSize());

        if (capacity <= GAME.model.warehouse.usedContainerCapacity()) {
            toastr.error(Controller.l("There is no room left for this order in the warehouse!"));
            // TODO try to fit what fits? - context
        } else {
            // add products to the containers.
            order.products.forEach((product) => this._processProduct(product));
            toastr.info(Controller.l("Order has been processed and added to the warehouse!"));

            // TODO make this work with the reference objects above (pass by reference bug on objects)
            let historyController = new HistoryController();
            historyController.log(order);
        }
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

        // progress bar
        $("#warehouse-progress-bar")
            .css({width: GAME.model.warehouse.usedContainerCapacity(true) + "%"})
            .attr("aria-valuenow", GAME.model.warehouse.usedContainerCapacity(true));
    }

    /**
     * @private
     */
    _processProduct(product)
    {
        for (let i = 0; i < GAME.model.warehouse.items.length; i++) {
            let container = GAME.model.warehouse.items[i];
            let availableCapacity = container.capacity - container.usedCapacity();

            // can fit at least one product!
            if (availableCapacity >= product.values.size) {
                let maxProducts = parseInt(availableCapacity / product.values.size);
                let addedQuantity = Math.min(product.values.quantity, maxProducts);

                let partialProduct = new Product(product.name, $.extend({}, product.values));
                partialProduct.values.quantity = addedQuantity;
                container.addItem(partialProduct);

                product.values.quantity = product.values.quantity - addedQuantity;
            }

            // this product has been stored by now.
            if (!product.values.quantity) {
                break;
            }
        }
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
        }, this).reduce(function(array, other){
            return array.concat(other);
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
