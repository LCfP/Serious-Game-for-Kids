$(document).ready(function ()
{
    // creates the global MODEL object
    new InitGameModel();

    // set-up game
    var controller = new InitGameController();
    controller.view();
});

