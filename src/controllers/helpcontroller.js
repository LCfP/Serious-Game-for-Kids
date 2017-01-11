class HelpController extends Controller
{
    startIntro()
    {
        var options = {
            // showSteps: true,
            delay: -1,
        };

        var trip = new Trip([
            {
                sel: $('.factory'),
                content: 'This is the factory, the place where all of your products are made.',
                expose: true,
                position: 'e',
                delay: 3000,
            },
            {
                sel: $('.factory .tab-content'),
                content: 'You can order specific amounts of each product. Try to add a product.',
                expose: true,
                position: 'e',
            },
            {
                sel: $('.factory .alert'),
                content: "Keep an eye on this info-box. It holds relevant information for the order you are placing. You need to have enough money (currently you have " + GAME.model.config.money + ") and the order has to fit on the truck (maximum capacity " + GAME.model.config.orderCapacity + ").",
                expose: true,
                position: 'e',
                delay: 8000
            },
            {
                sel: $('.factory button[type="submit"]'),
                content: "If everything is satisfied you can place the order by clicking on the green button.",
                expose: true,
                position: 'e',
            }
        ], options);

        trip.start();

        // Next step when the input of the form has changed
        $("form[name=newFactoryOrder] :input").change(function (e) {
            trip.next();
        });

        // TODO Button becomes white, since the 'trip-exposed' class is overwriting Bootstrap's styles.
        // This fixes it, but it's not really pretty. Should be a better way.
        $('.factory button[type="submit"]').css('background-color', '#5cb85c');

        // Next step when clicked on the 'place order' button
        $('.factory button[type="submit"]').click(function (e) {
            trip.next();
        });
    }
}
