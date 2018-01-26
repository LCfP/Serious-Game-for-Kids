import Controller from './core/controller';

import Cookies from 'js-cookie';

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

            GAME.model.config.scoreboard.room_name = response.room.name;
            GAME.model.config.scoreboard.team_name = response.team.name;

            GAME.model.message.success(Controller.l("You joined room ") + response.room.name + ".");
        }).fail(error => {
            GAME.model.message.error(Controller.l("That room does not exist or your team name is not unique."));
        });
        
        $('#create-team-modal').modal('hide');

        return true;
    }
}
