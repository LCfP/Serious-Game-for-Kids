// Javascript
import 'bootstrap/dist/js/bootstrap.min';

// Stylesheets
import 'bootstrap/dist/css/bootstrap.min.css';
import './scoreboard.css';


$(document).ready(function ()
{
    let scoreboardUrl = 'scoreboard.html';
    let scoreboardApiUrl = 'http://scoreboard.test';
    let roomName = getUrlParam('room');
    let timeBetweenUpdates = 30; // seconds

    $('[id^="page-"]').hide();

    if (roomName == undefined) {
        $('#page-home').show();
    } else {
        $('#page-room').show();

        getRoomInfo(roomName);
    }
    
    $('#search-room').click(e => {
        e.preventDefault();

        window.location = scoreboardUrl + '?room=' + $('#search-room-input').val();
    });

    $('#create-room').click(e => {
        e.preventDefault();
        
        $.ajax({
            method: 'POST',
            url: scoreboardApiUrl + '/rooms',
        }).done(data => {
            window.location = scoreboardUrl + '?room=' + data.name;
        });
    });

    function getRoomInfo(name) {
        $.ajax({
            method: 'GET',
            url: scoreboardApiUrl + '/rooms/' + name,
        }).done(data => {
            $('#room-name').text(data.name);

            getTeams(name);
            setTimer();

            setInterval(function () {
                getTeams(name);
                setTimer();
            }, timeBetweenUpdates * 1000);
        }).fail(error => {
            window.location = scoreboardUrl;
        });
    }

    function setTimer() {
        let timeLeft = timeBetweenUpdates;

        $('#scoreboard-timer').html(timeBetweenUpdates);

        let x = setInterval(() => {
            $('#scoreboard-timer').html(--timeLeft);

            if (timeLeft <= 0) {
                clearInterval(x);
            }
        }, 1 * 1000);
    }

    function getTeams(room) {
        $.ajax({
            url: scoreboardApiUrl + '/rooms/' + room + '/teams',
        }).done(teams => {
            updateTable(teams);
        })
    }

    function calculateScore(team) {
        return team.latest_score.money * team.latest_score.satisfaction / 100;
    }
    
    function updateTable(teams) {
        $('#table-content').empty();

        teams.sort(function (a, b) {
            return calculateScore(b) - calculateScore(a);
        });

        for (var i = 0; i < teams.length; i++) {
            let team = teams[i];
                
            var rowHtml = "<tr>";
            rowHtml += "<td>" + (i+1) + "</td>";
            rowHtml += "<td>" + team.name + "</td>";
            rowHtml += "<td><b>" + calculateScore(team) + "</b></td>";
            rowHtml += "<td>" + team.latest_score.money + "</td>";
            rowHtml += "<td>" + team.latest_score.satisfaction + "&percnt;</td>";
            rowHtml += "</tr>";

            $('#table-content').append(rowHtml);
        }
    }

    function getUrlParam(param) {
        let params = window.location.search.substring(1);
        params = params.split('&');

        for (var i = 0; i < params.length; i++) {
            let parameter = params[i].split('=');

            if (parameter[0] == param) {
                return parameter[1];
            }
        }
    }
});
