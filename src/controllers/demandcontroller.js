class DemandController extends Controller
{
    doCustomerOrderGeneration()
    {
        // TODO every day, and every once in a while (structural and variable?). We need to think about this.
        // Random component - About 1 per day = ~1.72, 2 per day = ~1.38.
        if (this._normalDistribution() > 1.72 || GAME.model.config.hours % 24 == 8) {
            const customerController = new CustomerController();
            customerController.generateOrder();
        }
    }
    /**
     * Returns a measure of demand for each product
     */
    randomDemandGenerator(demand)
    {
        const mean = demand.mean + this._seasonalComponent(demand.seasonality);

        return Math.max(
            this._normalDistribution(mean, demand.variance),
            0
        );
    }

    /**
     * Computes a seasonal modifier for specific demand. This is a multiplier to the product demand mean.
     *
     * @param {Object} seasonality
     * @private
     */
    _seasonalComponent(seasonality)
    {
        if (!seasonality.hasSeasonality) {
            return 1;
        }

        // TODO
        return 1;
    }

    /**
     * http://stackoverflow.com/a/36481059
     *
     * @private
     *
     * @param {number} mean=0
     * @param {number} variance=1
     * @returns {number}
     */
    _normalDistribution(mean = 0, variance = 1)
    {
        const u = 1 - Math.random();
        const v = 1 - Math.random();

        const stdNormal =  Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

        return stdNormal * variance + mean;
    }
}
