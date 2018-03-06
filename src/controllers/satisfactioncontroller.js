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

            if (customer.satisfaction <= config.sendAwayThreshold) {
                const customerController = new CustomerController();

                this.updatePlayerSatisfaction(customer);
                customerController.sendAway(customer);
                customerController.updateCustomerView();
            }
            if (customer.satisfaction < config.angryThreshold)
                //return $("img").data("customer") = "";
            if (customer.satisfaction < config.neutralThreshold) {
                $("#id").html("<img src=\"src/assets/emojis/neutralSmall.png\" alt=\"Smiley\">");
                const customerController = new CustomerController();

                customerController.updateCustomerView();
            }
        });
    }
}