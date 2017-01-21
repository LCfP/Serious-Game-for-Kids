class LevelController extends Controller
{
    checkGoalReached()
    {
        if (!this.hasNextLevel()) {
            return;
        }

        const currentLevel = GAME.model.levels[GAME.model.config.level];
        const cases = {
            "money": this.checkGoalMoney,
            "satisfaction": this.checkGoalSatisfaction
        };

        if ((cases[currentLevel.type].bind(this))(currentLevel)) {
            GAME.model.config.level++;
            this.completeLevel();
        }
    }

    completeLevel()
    {
        let text = Controller.l("You have reached the final level!");

        if (this.hasNextLevel()) {
            const nextLevel = GAME.model.levels[GAME.model.config.level];

            text = [
                Controller.l("Next: Reach"), Controller.l(nextLevel.type), Controller.l("with value"), nextLevel.goal
            ].join(" ") + ".";
        }

        swal({
            title: "Level " + (GAME.model.config.level - 1) + " " + Controller.l("completed"),
            text: text,
            type: "success",
            timer: GAME.model.config.swal["timer"],
            showConfirmButton: false
        });

        $('#level').html(GAME.model.config.level);
    }

    /**
     * @private
     */
    hasNextLevel()
    {
        return GAME.model.config.level < GAME.model.levels.length;
    }

    /**
     * @private
     */
    checkGoalMoney(level)
    {
        return GAME.model.config.money >= level.goal;
    }

    /**
     * @private
     */
    checkGoalSatisfaction(level)
    {
        return GAME.model.config.satisfaction >= level.goal;
    }
}
