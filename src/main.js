// bootstrap JS
import 'bootstrap/dist/js/bootstrap.min';

// vendor CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'toastr/build/toastr.css';
import './views/css/main.css';

import InitGameController from './controllers/initgamecontroller';
import InitGameModel from './models/initgamemodel';


$(document).ready(function ()
{
    window.GAME = {
        model: {},
        view: {}
    };

    // creates the global MODEL object
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
