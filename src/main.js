// Javascript
import 'bootstrap/dist/js/bootstrap.min';
import InitGameController from './controllers/initgamecontroller';
import InitGameModel from './models/initgamemodel';

// Stylesheets
import 'bootstrap/dist/css/bootstrap.min.css';
import 'toastr/build/toastr.css';
import './views/css/main.css';
import './views/css/playbuttons.css';


$(document).ready(function ()
{
    window.GAME = {
        model: {},
        view: {}
    };

    // Creates the model object
    new InitGameModel();
});

/**
 * Callback invoked when GAME is loaded
 */
export function initGame()
{
    const initGame = new InitGameController();
    initGame.view();
}
