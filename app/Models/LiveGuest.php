<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LiveGuest extends Model {
    protected $fillable = ['token','name','is_banned'];
    protected $hidden = ['token'];
    protected $casts = ['is_banned' => 'boolean'];
}