<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
