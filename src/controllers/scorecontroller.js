import Controller from "./core/controller";

export default class ScoreController extends Controller

{
    updateScore()
    {
        let config = GAME.model.config;

        config.score = config.money * (config.playerSatisfaction / 100);
        $("#score").html(config.score.toFixed(0));
    }
}