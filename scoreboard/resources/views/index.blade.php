<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

    <title>Scoreboard | Serious game for kids</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="/">Scoreboard</a>
            </div>

            <ul class="nav navbar-nav">
                <li><a id="create-room" href="#">Create Room</a></li>
            </ul>

            <form class="navbar-form navbar-left">
                <div class="form-group">
                    <input id="search-room-input"type="text" class="form-control" placeholder="2dk4">
                </div>
                <button id="search-room" class="btn btn-default">Search</button>
            </form>
        </div>
    </nav>

    <div class="container-fluid">
        <!-- If no roomname is given -->
        <section id="page-home">
            <h1>Scoreboard for the Serious Game</h1>

            <p>Use the buttons in the navigation bar on the top to create a room or go to an existing room.</p>
        </section>

        <!-- If a roomname is given -->
        <section id="page-room">
            <h1 style="margin: 0;">Room ID: <span id="room-name" style="letter-spacing: 2px; font-size: 50px;"></span></h1>
            <p>Connect to this scoreboard by going to ... using the room ID above.</p>

            <table class="table table-striped">
                <thead>
                    <th>#</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Money</th>
                    <th>Satisfaction</th>
                </thead>
                <tbody id="table-content"></tbody>
            </table>
        </section>
    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script>
        // $(document).ready(() => {
            $('[id^="page-"]').hide();

            let roomName = getUrlParam('room');

            if (roomName == undefined) {
                $('#page-home').show();
            } else {
                $('#page-room').show();

                getRoomInfo(roomName);
            }
        // });
        
        $('#search-room').click(e => {
            e.preventDefault();

            window.location = '?room=' + $('#search-room-input').val();
        });

        $('#create-room').click(e => {
            e.preventDefault();
            
            $.ajax({
                method: 'POST',
                url: '/rooms',
            }).done(data => {
                window.location = '?room=' + data.name;
            });
        });

        function getRoomInfo(name) {
            $.ajax({
                method: 'GET',
                url: '/rooms/' + name,
            }).done(data => {
                $('#room-name').text(data.name);

                updateRows(data.teams);
            }).fail(response => {
                console.log('reload');
                window.location = '/';
            });
        }
        
        function updateRows(teams) {
            for (var i = 0; i < teams.length; i++) {
                let team = teams[i];
    
                var rowHtml = "<tr>";
                rowHtml += "<td>" + team.rank + "</td>";
                rowHtml += "<td>" + team.name + "</td>";
                rowHtml += "<td>" + team.score + "</td>";
                rowHtml += "<td>" + team.money + "</td>";
                rowHtml += "<td>" + team.satisfaction + "</td>";
                rowHtml += "</tr>";
    
                $('#table-content').append(rowHtml);
            }
        }

        function getUrlParam(param) {
            let params = window.location.search.substring(1);
            params = params.split('&');

            for (var i = 0; i < params.length; i++) {
                let parameterName = params[i].split('=');

                if (parameterName[0] == param) {
                    return parameterName[1];
                }
            }
        }
    </script>
</body>
</html>
