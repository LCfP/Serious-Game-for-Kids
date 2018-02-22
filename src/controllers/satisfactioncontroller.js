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
        let config = GAME.model.config;

        const scoreController = new ScoreController();

        if (customer.satisfaction > 100)
            customer.satisfaction = 100;

        config.playerSatisfaction = ((config.playerSatisfaction * config.completedOrders) + (customer.satisfaction))
                                    / (config.completedOrders + 1);

        config.score = config.money * (config.playerSatisfaction/100);

        $("#satisfaction").html(GAME.model.config.playerSatisfaction.toFixed(0));

        scoreController.updateScore();
    }

    /**
     * Updates satisfaction of customers each time a new day occurs, and adds appropriate emojis.
     */
    updateCustomerSatisfaction()
    {
        GAME.model.customers.forEach(function (customer) {
            customer.satisfaction -= 10;

            const customerController = new CustomerController();

            let config = GAME.model.config;

            if (customer.satisfaction <= config.sendAwayThreshold)
                customerController.sendAway(customer);
                customerController.updateCustomerView();
            if (customer.satisfaction < config.angryThreshold)
                return $("#id").html("<img src=\"src/assets/emojis/angrySmall.png\" alt=\"Smiley\">");
            if (customer.satisfaction < config.neutralThreshold)
                return $("#id").html("<img src=\"src/assets/emojis/neutralSmall.png\" alt=\"Smiley\">");
        });
    }
}