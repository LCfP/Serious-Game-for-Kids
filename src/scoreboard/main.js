// Javascript
import 'bootstrap/dist/js/bootstrap.min';
import InitScoreboardController from './controllers/initscoreboardcontroller';
import InitScoreboardModel from './models/initscoreboardmodel';

// Stylesheets
import 'bootstrap/dist/css/bootstrap.min.css';
import './views/css/scoreboard.css';

$(document).ready(function ()
{
    window.GAME = {
        model: {},
        view: {}
    };

    // Creates the model object
    new InitScoreboardModel();
});

/**
 * Callback invoked when Scoreboard is loaded
 */
export function initScoreboard()
{
    const initScoreboard = new InitScoreboardController();
    initScoreboard.view();
}
