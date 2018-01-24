<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = [
        'name'
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function scores()
    {
        return $this->hasMany(Score::class);
    }

    public function latestScore()
    {
        return $this->hasOne(Score::class)->latest();
    }
}
