<?php

namespace App\Http\Controllers;

use App\Team;
use App\Room;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function store(Request $request)
    {
        $this->validate($request, [
            'team_name' => ['required', 'alpha_dash', 'unique:teams,name'],
            'room_name' => ['required', 'alpha_dash'],
        ]);

        $room = Room::where('name', $request->room_name)->firstOrFail();

        $team = $room->teams()->create([
            'name' => $request->team_name,
        ]);

        $score = $team->scores()->create([
            'money' => 0,
            'satisfaction' => 100
        ]);

        return response()->json(compact('room', 'team'));
    }
}
