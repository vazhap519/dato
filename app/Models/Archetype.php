<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Archetype extends Model
{
    protected $fillable = [
        'slug','title','subtitle','icon','description','strength','shadow',
        'question','practice','sort','is_published',
    ];
    protected $casts = ['sort' => 'integer', 'is_published' => 'boolean'];
}
