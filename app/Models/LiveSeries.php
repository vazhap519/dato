<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LiveSeries extends Model {
    protected $fillable = ['title'];
    public function sessions(): HasMany { return $this->hasMany(LiveSession::class); }
}