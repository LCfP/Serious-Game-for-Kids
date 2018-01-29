import Controller from './core/controller';


export default class ScoreboardController extends Controller
{
    view()
    {
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
        $.ajax({
            url: GAME.model.config.scoreboard.scoreboardApiUrl + '/teams',
            method: 'post',
            data: {
                room_name: formValues[0].value,
                team_name: formValues[1].value
            }
        }).done(response => {
            $('#open-create-team-modal').prop("disabled", true);

            GAME.model.config.scoreboard.room = response.room;
            GAME.model.config.scoreboard.team = response.team;

            GAME.model.message.success(Controller.l("You joined room ") + response.room.name + ".");

            setInterval(() => {
                this.logScore()
            }, 15 * 1000);
        }).fail(error => {
            GAME.model.message.error(Controller.l("That room does not exist or your team name is not unique."));
        });
        
        $('#create-team-modal').modal('hide');

        return true;
    }

    logScore()
    {
        if (! GAME.model.config.scoreboard.team || ! GAME.model.config.scoreboard.room) {
            console.log('No team or room name found');
            return;
        }

        $.ajax({
            url: GAME.model.config.scoreboard.scoreboardApiUrl + '/scores',
            method: 'post',
            data: {
                team_id: GAME.model.config.scoreboard.team.id,
                money: GAME.model.config.money,
                satisfaction: GAME.model.config.satisfaction,
            }
        }).done(data => {
            console.log(data)
        }).fail(error => {
            console.log(error)
        });
    }
}
