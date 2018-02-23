import Controller from './core/controller';


export default class ScoreboardController extends Controller
{
    view()
    {
        if (!GAME.model.config.scoreboard.enabled) {
            return;
        }

        this._loadTemplate(
            "src/views/template/scoreboard/modal.html",
            "#create-room-modal",
            {}
        ).done(() => this.registerEvent());
    }

    registerEvent()
    {
        const $handle = $("form[name=createTeam]");

        $handle.submit(
            (e) => {
                e.preventDefault();

                if (this.createTeam($handle.serializeArray())) {
                    $handle.trigger("reset");
                }
            }
        );
    }

    createTeam(formValues)
    {
        if (!GAME.model.config.scoreboard.enabled) {
            return;
        }

        $.post({
            url: GAME.model.config.scoreboard.apiUrl + '/teams',
            data: {
                room_name: formValues[0].value,
                team_name: formValues[1].value
            }
        }).done(response => {
            $('#open-create-team-modal').prop("disabled", true);

            GAME.model.config.scoreboard.room = response.room;
            GAME.model.config.scoreboard.team = response.team;

            GAME.model.message.success(Controller.l("You joined room") + " " + response.room.name + ".");

            this.logScore()
            setInterval(() => {
                this.logScore()
            }, GAME.model.config.scoreboard.sendScoreInterval * 1000);
        }).fail(error => {
            GAME.model.message.error(Controller.l("That room does not exist or your team name is not unique."));
        });
        
        $('#create-team-modal').modal('hide');

        return true;
    }

    logScore()
    {
        if (!GAME.model.config.scoreboard.enabled) {
            return;
        }

        if (! GAME.model.config.scoreboard.team || ! GAME.model.config.scoreboard.room) {
            return;
        }

        $.post({
            url: GAME.model.config.scoreboard.apiUrl + '/scores',
            data: {
                team_id: GAME.model.config.scoreboard.team.id,
                money: GAME.model.config.money,
                satisfaction: GAME.model.config.satisfaction,
            }
        });
    }
}
