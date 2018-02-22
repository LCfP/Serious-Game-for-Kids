import Controller from './core/controller';
import CustomerController from './customercontroller';

export default class SatisfactionController extends Controller

{
    /**
     * Updates player satisfaction after every completed order, as well as the score
     * @param customer
     */
    updatePlayerSatisfaction(customer)
    {
        const config = GAME.model.config;

        if (customer.satisfaction > 100)
            customer.satisfaction = 100;

        config.playerSatisfaction = ((config.playerSatisfaction * config.completedOrders) + (customer.satisfaction))
                                    / (config.completedOrders + 1);

        config.score = config.money * (config.playerSatisfaction/100);

        $("#satisfaction").html(GAME.model.config.playerSatisfaction.toFixed(0));
    }

    /**
     * Updates satisfaction of customers each time a new day occurs, and adds appropriate emojis.
     */
    updateCustomerSatisfaction()
    {
        GAME.model.customers.forEach(function (customer) {
            customer.satisfaction -= 10;

            const customerController = new CustomerController();

            if (customer.satisfaction <= 20)
                customerController.sendAway(customer);
                //view needs to be updated
            if (customer.satisfaction < 40)
                return $("#id").html("<img src=\"src/assets/emojis/angrySmall.png\" alt=\"Smiley\">");
            if (customer.satisfaction < 70)
                return $("#id").html("<img src=\"src/assets/emojis/neutralSmall.png\" alt=\"Smiley\">");
        });
    }

    /**
     * Updates score every hour, though maybe that's not the best interval/way.
     */
    updateScore()
    {
        const config = GAME.model.config;

        config.score = config.money * (config.playerSatisfaction/100);
        $("#score").html(config.score.toFixed(0));

    }
}