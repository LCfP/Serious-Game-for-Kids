<?php

namespace App\Http\Controllers;

use App\Team;
use App\Room;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    public function store(Request $request)
    {
        $this->validate($request, [
            'team_id' => ['required', 'integer'],
            'money' => ['required', 'numeric'],
            'satisfaction' => ['required', 'numeric'],
        ]);

        $team = Team::findOrFail($request->team_id);

        $score = $team->scores()->create([
            'money' => $request->money,
            'satisfaction' => $request->satisfaction,
        ]);

        return response(null, 200);
    }
}
