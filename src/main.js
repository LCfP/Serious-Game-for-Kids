$(document).ready(function ()
{
    // creates the global MODEL object
    new InitGameModel();
});

/**
 * Callback invoked when MODEL is loaded
 */
function initGame()
{
    var initGame = new InitGameController();
    initGame.view();
}
