$(document).ready(function ()
{
    // global, for easy access in controllers
    MODEL = initGameModel();

    // set-up game
    var controller = new InitGameController();
    controller.view();
});

function initGameModel()
{
    var warehouse = new Storage("Warehouse", 6);

    return {
        warehouse: warehouse
    }
}