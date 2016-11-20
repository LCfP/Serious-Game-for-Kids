$(document).ready(function ()
{
    initGame();
});

function initGame()
{
    // creates the global MODEL object, and when done sets-up the game
    // in initial state
    new InitGameModel();
}
