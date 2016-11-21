class HistoryController extends Controller
{
    view()
    {
        this._loadTemplate(
            "src/views/template/history.html",
            "#history",
            {}
        );
    }

    log(entry)
    {
        if (entry instanceof Customer)
        {
            this.addCustomer(entry);
        }

        if (entry instanceof Container)
        {
            this.addContainer(entry);
        }

        MODEL.history.push(entry);
    }

    addCustomer(customer)
    {
        this._loadTemplate(
            "src/views/template/history/customer.html",
            "#history-events",
            customer,
            true
        );
    }

    addContainer(container)
    {
        this._loadTemplate(
            "src/views/template/history/container.html",
            "#history-events",
            container,
            true
        );
    }
}
