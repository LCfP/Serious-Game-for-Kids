<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

    <title>Scoreboard | Serious game for kids</title>
</head>
<body>
    <button id="create-room">Create Room</button>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script>
        $('#create-room').click(function (e) {
            e.preventDefault();
            
            $.ajax({
                method: 'POST',
                url: '/rooms',
            }).done((data) => console.log(data));
        });
    </script>
</body>
</html>
