import Controller from './core/controller';


export default class HistoryController extends Controller
{
    log(entry)
    {
        GAME.model.history.push(entry);

        this._loadTemplate(
            "src/views/template/history/" + entry.constructor.name.toLowerCase() + ".html",
            "#history-events",
            entry,
            false,
            GAME.model.history.length !== 1 // first item on history list overwrites existing text
        );
    }
}
