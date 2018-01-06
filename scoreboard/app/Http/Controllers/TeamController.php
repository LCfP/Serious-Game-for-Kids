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
            'room_name' => ['required', 'alpha_dash', 'exists:rooms,name'],
        ]);

        $room = Room::where('name', $request->room_name)->first();

        $team = $room->teams()->create([
            'name' => $request->team_name,
        ]);

        return response(null, 200);
    }
}
