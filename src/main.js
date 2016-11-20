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

    // TODO wait for views to be loaded. [ Critical ]
    var sim = new SimulationController();
    sim.run();
}
