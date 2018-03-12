import Controller from './core/controller';
import CustomerController from './customercontroller';
import ScoreController from "./scorecontroller";

export default class SatisfactionController extends Controller
{
    /**
     * Updates player satisfaction after every completed order, as well as the score
     * @param customer
     */
    updatePlayerSatisfaction(customer)
    {
        if (customer.satisfaction > 100)
            customer.satisfaction = 100;

        let config = GAME.model.config;

        config.playerSatisfaction = ((config.playerSatisfaction * config.completedOrders) + (customer.satisfaction))
                                    / (config.completedOrders + 1);

        $("#satisfaction").html(config.playerSatisfaction.toFixed(0));

        const scoreController = new ScoreController();

        scoreController.updateScore();
    }

    /**
     * Updates satisfaction of customers each time a new day occurs, and adds appropriate emojis.
     */
    updateCustomerSatisfaction()
    {
        GAME.model.customers.forEach(customer => {
            customer.satisfaction -= 10;

            let config = GAME.model.config;
            const customerController = new CustomerController();

            if (customer.satisfaction <= config.sendAwayThreshold)
            {
                this.updatePlayerSatisfaction(customer);
                customerController.sendAway(customer);
                customerController.updateCustomerView();
            }
            if (customer.satisfaction < config.angryThreshold)
            {
                $("#customer-data").attr("src", "src/assets/img/emojis/angrySmall.png");

                customerController.updateCustomerView();
            }
            if (customer.satisfaction < config.neutralThreshold)
            {
                $("#customer-data").attr("src", "src/assets/img/emojis/neutralSmall.png");

                customerController.updateCustomerView();
            }
        });
    }
}