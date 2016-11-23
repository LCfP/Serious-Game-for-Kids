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
        var location = "";

        if (entry instanceof Customer) {
            location = "customer";
        } else if (entry instanceof Container) {
            location = "container";
        } else {
            return;
        }

        this._loadTemplate(
            "src/views/template/history/" + location + ".html",
            "#history-events",
            entry,
            false,
            true
        );

        MODEL.history.push(entry);
    }
}
