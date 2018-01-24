<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return view('index');
});

$router->get('/rooms/{room}', 'RoomController@show');
$router->post('/rooms', 'RoomController@store');

$router->get('/rooms/{room}/teams', 'RoomController@showTeams');

$router->post('/teams', 'TeamController@store');

$router->post('/scores', 'ScoreController@store');
