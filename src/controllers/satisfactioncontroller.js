class SatisfactionController extends Controller
{
    /**
     * Updates the current amount of money. Note that amount is added to GAME.model.config.money,
     * so input negative amount to subtract!
     *
     * @param {float} amount - the amount to be added to the current amount of money
     */
    static updateSatisfaction(amount)
    {
        var b1 = GAME.model.config.weightDeliverySwiftness;
        var b2 = GAME.model.config.weightQualityDeliveredOrder;

        var decrease = (b1 + b2) * amount;

        GAME.model.config.satisfation = GAME.model.config.satisfaction - parseFloat(decrease);
        $("#satisfaction").html(GAME.model.config.satisfaction.toFixed(2));
    }
}
