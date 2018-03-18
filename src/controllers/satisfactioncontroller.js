import Controller from './core/controller';
import CustomerController from './customercontroller';
import ScoreController from './scorecontroller';


export default class SatisfactionController extends Controller
{
    /**
     * Updates player satisfaction after every completed order, as well as the score
     * @param customer
     */
    updatePlayerSatisfaction(customer)
    {
        if (customer.satisfaction > 100) {
            customer.satisfaction = 100;
        }

        let config = GAME.model.config;

        config.playerSatisfaction = ((config.playerSatisfaction * config.completedOrders) + (customer.satisfaction))
                                    / (config.completedOrders + 1);

        $("#satisfaction").html(config.playerSatisfaction.toFixed(0));

        (new ScoreController()).updateScore();
    }

    /**
     * Updates satisfaction of customers each time a new day occurs, and adds appropriate emojis.
     */
    updateCustomerSatisfaction()
    {
        const customerController = new CustomerController();

        GAME.model.customers.forEach(customer => {
            customer.satisfaction -= 10;

            if (customer.satisfaction <= GAME.model.config.sendAwayThreshold) {
                this.updatePlayerSatisfaction(customer);
                customerController.sendAway(customer);
            }
        });

        customerController.updateCustomerView();
    }
}
