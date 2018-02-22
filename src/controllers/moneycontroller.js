import Controller from './core/controller';
import ScoreController from "./scorecontroller";


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
        let config = GAME.model.config;

        const scoreController = new ScoreController();

        config.money = config.money + parseFloat(amount);
        $("#money").html(config.money.toFixed(2));

        scoreController.updateScore();
    }
}
