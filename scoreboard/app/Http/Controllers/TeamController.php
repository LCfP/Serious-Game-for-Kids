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
            'team_name' => ['required', 'alpha_dash'],
            'room_name' => ['required', 'alpha_dash'],
        ]);

        $room = Room::where('name', $request->room_name)->firstOrFail();

        // Check if the room already has a team with the given team_name
        if ($room->teams->pluck('name')->contains($request->team_name)) {
            return response(null, 404);
        }

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
