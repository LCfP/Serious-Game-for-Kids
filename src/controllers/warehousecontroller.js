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
     * @param {Array} products - The list of Products
     */
    addOrder(order)
    {
        var products = order.products;

        let capacity = products.reduce((sum, prod) => sum + prod.shelfSize());

        if (capacity <= GAME.model.warehouse.usedContainerCapacity()) {
            toastr.error(Controller.l("There is no room left for this order in the warehouse!"));
            // TODO try to fit what fits? - context
        } else {
            products.forEach(
                function (product) {
                    for (let i in GAME.model.warehouse.items) {
                        let container = GAME.model.warehouse.items[i];
                        let availableCapacity = container.capacity - container.usedCapacity();

                        if (availableCapacity >= product.shelfSize()) {
                            container.addItem(product);
                            break;
                        } else if (availableCapacity >= product.size) {
                            let maxProducts = parseInt(availableCapacity / product.size);
                            let partialProduct = new Product(
                                product.name,
                                Math.min(product.quantity, maxProducts),
                                product.price,
                                product.size,
                                product.isPerishable,
                                product.perishable
                            );

                            container.addItem(partialProduct);

                            product.quantity = product.quantity - partialProduct.quantity;
                        }
                    }
                }
            );

            var history = new HistoryController();
            history.log(order);
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
