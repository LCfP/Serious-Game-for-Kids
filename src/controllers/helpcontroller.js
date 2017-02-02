class HelpController extends Controller
{
    constructor()
    {
        super();

        this.tripInit = {
            "Warehouse": (trip) => {
                trip.start();

                $("#purchase-container").css("background-color", "#5cb85c")
            },
            "StatusBar": (trip) => {
                trip.start();

                $('.timer').click(function () {
                    trip.next();
                });
            },
            "FactoryOrders": (trip) => {
                if (GAME.model.orders.length) {
                    trip.start();
                } else {
                    toastr.warning(Controller.l("Make sure you have placed an order at the factory."));
                }
            },
            "Factory": (trip) => {
                trip.start();

                // Next step when the input of the form has changed
                $("form[name=newFactoryOrder] :input").change(function (e) {
                    trip.next();
                });

                // TODO Button becomes white, since the 'trip-exposed' class is overwriting Bootstrap's styles.
                // This fixes it, but it's not really pretty. Should be a better way.
                $(".factory button[type=submit]").css("background-color", "#5cb85c");

                // Next step when clicked on the 'place order' button
                $(".factory button[type=submit]").click(function (e) {
                    trip.next();
                });
            },
            "Customers": (trip) => {
                if (GAME.model.customers.length) {
                    trip.start();
                } else {
                    toastr.warning(Controller.l("There has to be at least one customer. Start the game by pressing the 'play' button. Customers will the pop up automatically."), "", {timeOut: 7000});
                }
            }
        }
    }

    makeTrip(tour, props)
    {
        const trip = new Trip(this._makeTour(GAME.model.trips.tours[tour]), {
            delay: props.delay || 5000,
            onEnd: () => {if (props.intro) ""}
        });

        this.tripInit[tour](trip);
    }

    /**
     * @private
     */
    _makeTour(protoTour)
    {
        return protoTour.map((destination) => {
            let elem = {
                sel: $(destination.anchor),
                content: Controller.l(destination.content),
                expose: destination.hasOwnProperty("expose") && destination.expose,
                position: destination.position
            };

            if (destination.hasOwnProperty("delay")) {
                elem["delay"] = destination.delay;
            }

            return elem;
        });
    }
}
