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

            var historyController = new HistoryController();
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
        $("#warehouse-used-capacity").html(GAME.model.warehouse.usedContainerCapacity());
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

                let partialProduct = new Product(
                    product.name,
                    product.values
                );

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
            "src/views/template/warehouse.html",
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
                // groups items by size, so each items can be represented
                // as an icon (per `iconPerAmountProductSize` size).
                container.itemsBySize = function () {
                    return container.items.map(function (item) {
                        let amountIcons = Math.floor(item.shelfSize() / GAME.model.config.iconPerAmountProductSize);

                        // display at least one icon per product per container.
                        return new Array(Math.max(amountIcons, 1)).fill({
                            "name" : item.name,
                            "img": item.values.icon
                        });
                    }).reduce(function(array, other){
                        return array.concat(other);
                    }, []);
                };

                // for the progress bar
                container.percentage = container.usedCapacity(true);

                super._loadTemplate(
                    "src/views/template/container.html",
                    "#containers",
                    container,
                    true
                );
            }
        );
    }
}
