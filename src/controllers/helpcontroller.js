class HelpController extends Controller
{
    static startIntroTour()
    {
        if (Cookies.get('firstVisit') != 'no') {
            HelpController.startNavbarTour(true);
            Cookies.set('firstVisit', 'no', {expires: 7});
        }
    }

    static startNavbarTour(intro = false)
    {
        var trip = new Trip([
            {
                sel: $("#sidebar-left-toggle"),
                content: Controller.l("This button opens the menu. You can change settings there."),
                position: "e",
            },
            {
                sel: $(".timer").parent(),
                content: Controller.l("With these buttons you can start and stop the simulation of the game. Try to start the game."),
                position: "e",
                delay: -1,
            },
            {
                sel: $("#sidebar-right-toggle"),
                content: Controller.l("With this button you open the sidebar which gives you an overview of everything that happened in the past."),
                position: "w",
            },
            {
                sel: $(".help-menu"),
                content: Controller.l("Don't know how some part of <br> the game works? Click this <br> button to get more info."),
                position: "s"
            },
            {
                sel: $(".statuses"),
                content: Controller.l("These represent your current status in the game."),
                position: "s"
            }
        ], {
            delay: 4000,
            onEnd: function () {
                if (intro) {
                    HelpController.startFactoryTour(true);
                }
            }
        });

        trip.start();

        $('.timer').click(function () {
            trip.next();
        });
    }

    static startFactoryTour(intro = false)
    {
        var trip = new Trip([
            {
                sel: $(".factory"),
                content: Controller.l("This is the factory, the place where all of your products are made."),
                expose: true,
                position: "e",
                delay: 3000,
            },
            {
                sel: $(".factory .tab-content"),
                content: Controller.l("You can order specific amounts of each product. Try to add a product."),
                expose: true,
                position: "e",
            },
            {
                sel: $(".factory .alert"),
                content: Controller.l("Keep an eye on this info-box. It holds relevant information for the order you are placing. You need to have enough money (currently you have") + " " + GAME.model.config.money + ") " + Controller.l("and the order has to fit on the truck (maximum capacity is") + " " + GAME.model.config.orderCapacity + ").",
                expose: true,
                position: "e",
                delay: 8000
            },
            {
                sel: $(".factory button[type=submit]"),
                content: Controller.l("If everything is satisfied you can place the order by clicking on the green button."),
                expose: true,
                position: "e",
            }
        ], {
            delay: -1,
            position: "e",
            onEnd: function () {
                if (intro) {
                    HelpController.startFactoryOrdersTour(true);
                }
            }
        });

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
    }

    static startFactoryOrdersTour(intro = false)
    {
        var trip = new Trip([
            {
                sel: $("#factory-orders"),
                content: Controller.l("This is where you can see all orders currently in transport to your warehouse."),
                expose: true,
                position: "e",
            },
            {
                sel: $("#factory-orders .progress").first(),
                content: Controller.l("The order will arrive in the warehouse, when the progress bar is fully green. Do make sure you clicked the 'play' button in the statusbar."),
                expose: true,
                position: "e",
            }
        ], {
            delay: 5000,
            onEnd: function () {
                if (intro) {
                    HelpController.startWarehouseTour(true);
                }
            }
        });

        if (GAME.model.orders.length) {
            trip.start();
        } else {
            toastr.warning(Controller.l("Make sure you have placed an order at the factory."));
        }
    }

    static startWarehouseTour(intro = false)
    {
        var trip = new Trip([
            {
                sel: $("#warehouse .panel"),
                content: Controller.l("Here are your containers where you can store incoming products from the factory."),
                expose: true,
                position: "n",
            },
            {
                sel: $("#warehouse .pull-right"),
                content: Controller.l("Here you can see the capacity that is used."),
                expose: true,
                position: "s"
            },
            {
                sel: $("#containers .panel").first(),
                content: Controller.l("The colored circle around the product changes as the product perishes. When the product turns red, it will be removed from the warehouse within a few days."),
                expose: true,
                position: "e",
            },
            {
                sel: $("#purchase-container"),
                content: Controller.l("You can purchase another container by clicking on this button."),
                expose: true,
                position: "s"
            }
        ], {
            delay: 5000,
            onEnd: function () {
                if (intro) {
                    HelpController.startCustomersTour(true);
                }
            }
        });

        trip.start();

        $("#purchase-container").css("background-color", "#5cb85c");
    }

    static startCustomersTour()
    {
        var trip = new Trip([
            {
                sel: $("#customers .panel"),
                content: Controller.l("This list displays the customers you can serve."),
                expose: true,
                position: "w",
            },
            {
                sel: $("#customer-orders").children().first(),
                content: Controller.l("This is a single customer. You can send <br> him away if you don't want to serve him. Or click serve customer <br>to give the customer the products he wants. Of course <br> you need to have them in stock."),
                expose: true,
                position: "w",
            }
        ], {
            delay: 6000,
        });

        if (GAME.model.customers.length) {
            trip.start();
        } else {
            toastr.warning(Controller.l("There has to be at least one customer. Start the game by pressing the 'play' button. Customers will the pop up automatically."), "", {timeOut: 7000});
        }
    }
}
