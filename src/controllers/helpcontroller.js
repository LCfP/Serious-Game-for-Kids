class HelpController extends Controller
{
    startIntroTour()
    {
        //
    }

    startFactoryTour()
    {
        var trip = new Trip([
            {
                sel: $('.factory'),
                content: 'This is the factory, the place where all of your products are made.',
                expose: true,
                position: "e",
                delay: 3000,
            },
            {
                sel: $('.factory .tab-content'),
                content: 'You can order specific amounts of each product. Try to add a product.',
                expose: true,
                position: "e",
            },
            {
                sel: $('.factory .alert'),
                content: "Keep an eye on this info-box. It holds relevant information for the order you are placing. You need to have enough money (currently you have " + GAME.model.config.money + ") and the order has to fit on the truck (maximum capacity " + GAME.model.config.orderCapacity + ").",
                expose: true,
                position: "e",
                delay: 8000
            },
            {
                sel: $('.factory button[type="submit"]'),
                content: "If everything is satisfied you can place the order by clicking on the green button.",
                expose: true,
                position: "e",
            }
        ], {
            delay: -1,
            position: "e",
        });

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

    startNavbarTour()
    {
        var trip = new Trip([
            {
                sel: $("#sidebar-left-toggle"),
                content: "This button opens the menu. You can change settings there.",
                position: "e",
            },
            {
                sel: $(".timer").parent(),
                content: "With these buttons you can start and stop the simulation of the game.",
                position: "e",
            },
            {
                sel: $("#sidebar-right-toggle"),
                content: "With this button you open the sidebar which gives you an overview of everything that happened in the past.",
                position: "w",
            },
            {
                sel: $(".help-menu"),
                content: "Don't know how some part of <br> the game works? Click this <br> button to get more info.",
                position: "s"
            },
            {
                sel: $(".statuses"),
                content: "These represent your current status in the game.",
                position: "s"
            }
        ], {
            delay: 4000,
        });

        trip.start();
    }

    startFactoryOrdersTour()
    {
        var trip = new Trip([
            {
                sel: $('#factory-orders'),
                content: "This is where you can see all orders currently in transport to your warehouse. Make sure the play button in the status bar is clicked.",
                expose: true,
                position: "e",
            },
            {
                sel: $("#factory-orders .progress").first(),
                content: "The order will arrive in the warehouse, when the progress bar is fully green. Do make sure you clicked the 'play' button in the statusbar.",
                expose: true,
                position: "e",
            }
        ], {
            delay: 3000,
        });

        if (GAME.model.orders.length) {
            trip.start();
        } else {
            toastr.warning("Make sure you have placed an order at the factory.");
        }
    }

    startWarehouseTour()
    {
        var trip = new Trip([
            {
                sel: $('#warehouse .panel'),
                content: "Here are your containers where you can store incoming products from the factory.",
                expose: true,
                position: "n",
            },
            {
                sel: $('#warehouse .pull-right'),
                content: "Here you can see the capacity that is left.",
                expose: true,
                position: "s"
            },
            {
                sel: $("#containers .panel").first(),
                content: "The colored circle around the product changes as the product perishes. When the product turns red, it will be removed from the warehouse within a few days.",
                expose: true,
                position: "e",
            },
            {
                sel: $("#purchase-container"),
                content: "You can purchase another container by clicking on this button.",
                expose: true,
                position: "s"
            }
        ], {
            delay: 5000,
        });

        trip.start();

        $('#purchase-container').css('background-color', '#5cb85c');
    }

    startCustomersTour()
    {
        var trip = new Trip([
            {
                sel: $('#customers .panel'),
                content: "This list displays the customers you can serve.",
                expose: true,
                position: "w",
            },
            {
                sel: $("#customer-orders").children().first(),
                content: "This is a single customer. You can send <br> him away if you don't want to serve him. Or click serve customer <br>to give the customer the products he wants. Of course <br> you need to have them in stock.",
                expose: true,
                position: "w",
            }
        ], {
            delay: 6000,
        });

        if (GAME.model.customers.length) {
            trip.start();
        } else {
            toastr.warning("There has to be at least one customer. Start the game by pressing the 'play' button. Customers will the pop up automatically.", "", {timeOut: 7000});
        }
    }
}