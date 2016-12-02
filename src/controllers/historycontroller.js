class HistoryController extends Controller
{
    log(entry)
    {
        var location = "";

        if (entry instanceof Customer) {
            location = "customer";
        } else if (entry instanceof Container) {
            location = "container";
        } else if (entry instanceof FactoryOrder) {
            location = "factoryorder";
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

        GAME.model.history.push(entry);
    }
}
