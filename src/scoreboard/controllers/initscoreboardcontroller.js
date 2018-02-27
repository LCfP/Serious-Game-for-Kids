import Controller from './controller';

export default class InitGameController extends Controller
{
    /**
     * Displays the initial state
     *
     * @override
     */
    view()
    {
        [
            //
        ].forEach(
            function (controller) {
                controller.view();
            }
        );

        $.when(
            this._setTopbar(),
        ).done(
            () => {
                this.registerEvent();
            }
        );
    }
    
    registerEvent()
    {        
        const roomName = this._getUrlParam('room');
        
        if (roomName == undefined) {
            this._loadPageHome();
        } else {
            this._getRoomInfo(roomName);

            this._loadPageRoom();
        }
        
        $('#create-room').click(e => {
            e.preventDefault();
            
            $.post(GAME.model.config.scoreboard.apiUrl + '/rooms').done(data => {
                window.location = '?room=' + data.name;
            });
        });
        
        $('#search-room').click(e => {
            e.preventDefault();
            
            window.location = '?room=' + $('#search-room-input').val();
        });
    }

    _getRoomInfo(name) {
        $.get(GAME.model.config.scoreboard.apiUrl + '/rooms/' + name).done(data => {
            $('#room-name').text(data.name);
    
            this._getTeams(name);
            this._setTimer();
    
            setInterval(() => {
                this._getTeams(name);
                this._setTimer();
            }, GAME.model.config.scoreboard.updateInterval * 1000);
        }).fail(error => {
            window.location = GAME.model.config.scoreboard.url;
        });
    }

    _setTimer() {
        let timeLeft = GAME.model.config.scoreboard.updateInterval;
    
        $('#scoreboard-timer').html(timeLeft);
    
        let x = setInterval(() => {
            $('#scoreboard-timer').html(--timeLeft);
    
            if (timeLeft <= 0) {
                clearInterval(x);
            }
        }, 1 * 1000);
    }

    _getTeams(room)
    {
        $.get(GAME.model.config.scoreboard.apiUrl + '/rooms/' + room + '/teams').done(teams => {
            this._updateTable(teams);
        });
    }

    _calculateScore(money, satisfaction) {
        return money * satisfaction / 100;
    }

    _updateTable(teams)
    {
        $('#table-content').empty();

        teams.map(team => {
            return {
                name: team.name,
                score: this._calculateScore(team.latest_score.money, team.latest_score.satisfaction),
                money: team.latest_score.money,
                satisfaction: team.latest_score.satisfaction,
            }
        })
        .sort((a, b) => {
            return b.score - a.score;
        })
        .map((team, index) => {
            this._loadTemplate(
                "src/scoreboard/views/template/table-row.html",
                "#table-content",
                {
                    team,
                    rank: index + 1
                },
                true
            );
        });
    }

    _loadPageHome()
    {
        return this._loadTemplate(
            "src/scoreboard/views/template/page-home.html",
            "#page",
            {}
        );
    }

    _loadPageRoom(data = {})
    {
        return this._loadTemplate(
            "src/scoreboard/views/template/page-room.html",
            "#page",
            data
        )
    }
    
    /**
     * @private
     */
    _setTopbar()
    {
        return this._loadTemplate(
            "src/scoreboard/views/template/topbar.html",
            "#top-bar",
            {}
        );
    }

    _getUrlParam(param)
    {
        const params = window.location.search.substring(1).split('&');
    
        for (var i = 0; i < params.length; i++) {
            const parameter = params[i].split('=');
    
            if (parameter[0] == param) {
                return parameter[1];
            }
        }
    }
}
