"use strict";

$(document).ready(function () {
    window.GAME = {
        model: {},
        view: {}
    };

    // creates the global MODEL object
    new InitGameModel();
});

/**
 * Callback invoked when MODEL is loaded
 */
function initGame() {
    var initGame = new InitGameController();
    initGame.view();
}