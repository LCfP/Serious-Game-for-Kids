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
function initGame()
{
    const initGame = new InitGameController();
    initGame.view();
}
