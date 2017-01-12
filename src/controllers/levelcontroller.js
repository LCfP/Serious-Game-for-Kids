class LevelController extends Controller
{
    checkGoalReached()
    {
        let currentLevelId = GAME.model.config.level;
        let currentLevel = GAME.model.levels[currentLevelId];
        let completed = false;

        // TODO Make this prettier, gets bloated when adding more types of levels
        if (currentLevel.type == 'money') {
            completed = this.checkGoalMoney(currentLevel);
        } else if (currentLevel.type == 'satisfaction') {
            completed = this.checkGoalSatisfaction(currentLevel);
        }

        if (completed) {
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
