class HistoryController extends Controller
{
    log(entry)
    {
        GAME.model.history.push(entry);

        this._loadTemplate(
            "src/views/template/history/" + entry.constructor.name + ".html",
            "#history-events",
            entry,
            false,
            true
        );
    }
}
