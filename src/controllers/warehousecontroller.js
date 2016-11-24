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
        MODEL.warehouse.updatePerishableProducts();
    }

    /**
     * Adds the contents of an order to the Warehouse.
     *
     * @param {Array} products - The list of Products
     */
    addOrder(products)
    {
        let capacity = products.reduce((sum, prod) => sum + prod.shelfSize());

        if (capacity <= MODEL.warehouse.usedContainerCapacity()) {
            toastr.error(Controller.l("There is no room left for this order in the warehouse!"));
            // TODO try to fit what fits? - context
        } else {
            products.forEach(
                function (product) {
                    for (let i in MODEL.warehouse.items) {
                        let container = MODEL.warehouse.items[i];
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
        $("#warehouse-used-capacity").html(MODEL.warehouse.usedContainerCapacity());
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
            MODEL.warehouse
        );
    }

    /**
     * Helper method to fill the warehouse view with containers.
     *
     * @private
     */
    _containerHelper()
    {
        MODEL.warehouse.items.forEach(
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
