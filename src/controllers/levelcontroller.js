class LevelController extends Controller
{
    checkGoalReached()
    {
        const currentLevel = GAME.model.levels[GAME.model.config.level];
        const cases = {
            "money": this.checkGoalMoney,
            "satisfaction": this.checkGoalSatisfaction
        };

        if ((cases[currentLevel.type].bind(this))(currentLevel)) {
            this.completeLevel(currentLevel);
        }
    }

    completeLevel(level)
    {
        let nextLevel = GAME.model.levels[GAME.model.config.level + 1];

        swal({
            title: "Level " + GAME.model.config.level + " " + Controller.l("completed"),
            text: Controller.l("Next: Reach") + " " + Controller.l(nextLevel.type) + " " + Controller.l("with value") + " " + nextLevel.goal + ".",
            type: "success",
            timer: 5000,
            showConfirmButton: false
        });

        GAME.model.config.level++;
        $('#level').html(GAME.model.config.level);
    }

    checkGoalMoney(level)
    {
        return GAME.model.config.money >= level.goal;
    }

    checkGoalSatisfaction(level)
    {
        return GAME.model.config.satisfaction >= level.goal;
    }
}
