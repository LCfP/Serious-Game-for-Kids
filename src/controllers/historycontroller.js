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
            this._loadTemplate(
                "src/views/template/history/customer.html",
                "#history-events",
                entry,
                false,
                true
            );
        }

        if (entry instanceof Container)
        {
            this._loadTemplate(
                "src/views/template/history/container.html",
                "#history-events",
                entry,
                false,
                true
            );
        }

        MODEL.history.push(entry);
    }
}
