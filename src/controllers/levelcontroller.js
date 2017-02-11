class LevelController extends Controller
{
    checkGoalReached()
    {
        if (!this._hasNextLevel()) {
            return;
        }

        const currentLevel = GAME.model.levels[GAME.model.config.level];
        const cases = {
            "money": this._checkGoalMoney,
            "satisfaction": this._checkGoalSatisfaction
        };

        return cases[currentLevel.type].bind(this)(currentLevel);
    }

    completeLevel()
    {
        let text = Controller.l("You have reached the final level!");
        GAME.model.config.level++;

        if (this._hasNextLevel()) {
            const nextLevel = GAME.model.levels[GAME.model.config.level];

            text = [
                Controller.l("Next: Reach"),
                Controller.l(nextLevel.type),
                Controller.l("with value"),
                nextLevel.goal
            ].join(" ") + ".";
        }

        swal({
            title: "Level " + (GAME.model.config.level - 1) + " " + Controller.l("completed"),
            text: text,
            type: "success",
            timer: GAME.model.config.swal["timer"],
            showConfirmButton: false
        });

        (new FactoryController)._updateFactory();

        $('#level').html(GAME.model.config.level);
    }

    /**
     * @private
     */
    _hasNextLevel()
    {
        return GAME.model.config.level < GAME.model.levels.length;
    }

    /**
     * @private
     */
    _checkGoalMoney(level)
    {
        return GAME.model.config.money >= level.goal;
    }

    /**
     * @private
     */
    _checkGoalSatisfaction(level)
    {
        return GAME.model.config.satisfaction >= level.goal;
    }
}
