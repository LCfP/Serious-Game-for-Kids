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
     * Updates satisfaction of customers each time a new day occurs.
     */
    updateCustomerSatisfaction()
    {
        GAME.model.customers.forEach(function (customer) {
            customer.satisfaction -= 10;

            const customerController = new CustomerController();

            if (customer.satisfaction <= 20)
                customerController.sendAway(customer);
                $("#customers").html; //Update view of customers, but this doesn't work.
            if (customer.satisfaction < 50)
                return $("#emoji").html("<img src=\"src/assets/emojis/happy.png\" alt=\"Smiley\">");
            if (customer.satisfaction < 70)
                return console.log("This customer's satisfaction is below 70, namely " + customer.satisfaction);
            //else
            //happyface


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