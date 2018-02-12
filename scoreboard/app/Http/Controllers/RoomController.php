<?php

namespace App\Http\Controllers;

use App\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function show($room) {
        $foundRoom = Room::where('name', $room)->firstOrFail();

        return response()->json($foundRoom);
    }

    public function showTeams($room) {
        $foundRoom = Room::where('name', $room)->firstOrFail();

        $teams = $foundRoom->teams()->with('latestScore')->get();

        return response()->json($teams);
    }

    public function store(Request $request)
    {
        $unique = false;

        while (!$unique) {
            $random = strtolower(str_random(4));

            if (Room::where('name', $random)->count() == 0) {
                $unique = true;
            }
        }

        $room = new Room;
        $room->name = $random;
        $room->save();

        return response()->json([
            'name' => $room->name,
        ]);
    }
}
