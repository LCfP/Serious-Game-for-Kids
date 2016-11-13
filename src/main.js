$(document).ready(function ()
{
    var model = new InitGameModel();
    model.setupModel();

    // turns this model into a global MODEL
    model.toObject();

    // set-up game
    var controller = new InitGameController();
    controller.view();
});

