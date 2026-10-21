<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsefulLink extends Model
{
    protected $fillable = ['title', 'description', 'url', 'icon', 'sort', 'is_active'];
    protected $casts = ['is_active' => 'boolean', 'sort' => 'integer'];
}
