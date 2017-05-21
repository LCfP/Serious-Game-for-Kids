import Controller from './core/controller';


export default class MoneyController extends Controller
{
    /**
     * Updates the current amount of money. Note that amount is added to GAME.model.config.money,
     * so input negative amount to subtract!
     *
     * @param {float} amount - the amount to be added to the current amount of money
     */
    static updateMoney(amount)
    {
        GAME.model.config.money = GAME.model.config.money + parseFloat(amount);
        $("#money").html(GAME.model.config.money.toFixed(2));
    }
}
