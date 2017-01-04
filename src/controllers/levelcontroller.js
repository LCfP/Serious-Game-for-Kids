class LevelController extends Controller
{
    checkGoalReached()
    {
        let currentLevelId = GAME.model.config.currentLevel;
        let currentLevel = GAME.model.levels[currentLevelId];
        var completed = false;

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
        swal({
            title: "Completed!",
            text: "You completed level " + level.id + "!",
            type: "success",
            timer: 4000,
            showConfirmButton: false
        });

        GAME.model.config.currentLevel++;

        // might want to reset the game
    }

    checkGoalMoney(level)
    {
        return GAME.model.config.money >= level.goal;
    }

    checkGoalSatisfaction(level)
    {
        // will always return true, since satisfaction is not yet implemented
        return GAME.model.config.satisfaction >= level.goal;
    }
}
