class HistoryController extends Controller
{
    static addEvent(event)
    {
        if (event instanceof Customer)
        {
            console.log('event is customer');

            // this._loadTemplate(
            //     "src/views/template/history/customer.html",
            //     "#history-events",
            //     event,
            //     true
            // );
            //
            // this.addCustomer(event);

            /**
             * The above method calls are not working,
             * I get this error:
             *
             * Uncaught TypeError: this._loadTemplate is not
             * a function at Function.addEvent
             * (http://localhost:8888/Serious-Game-for-Kids/src/controllers/historycontroller.js:9:18)at <anonymous>:1:19
             */
        }

        if (event instanceof Container)
        {
            console.log('event is container');
            this.addContainer(event);
        }

        MODEL.history.push(event);
    }


    addCustomer(customer)
    {
        console.log('Customer added');
    }

    addContainer(container)
    {
        console.log('Container added');
    }
}
