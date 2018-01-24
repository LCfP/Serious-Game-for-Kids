<?php

namespace App\Http\Controllers;

use App\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function show($room) {
        $room = Room::where('name', $room)->firstOrFail();

        return response()->json($room);
    }

    public function showTeams($room) {
        $room = Room::where('name', $room)->firstOrFail();

        $teams = $room->teams()->with('latestScore')->get();

        return response()->json($teams);
    }

    public function store(Request $request)
    {
        $unique = false;

        do {
            $random = strtolower(str_random(4));

            if (Room::where('name', $random)->count() == 0) {
                $unique = true;
            }
        }
        while (! $unique);

        $room = new Room;
        $room->name = $random;
        $room->save();

        return response()->json([
            'name' => $room->name,
        ]);
    }
}
