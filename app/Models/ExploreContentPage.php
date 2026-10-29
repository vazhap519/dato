<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExploreContentPage extends Model
{
    protected $fillable = ['slug', 'title', 'copy'];

    protected function casts(): array
    {
        return ['copy' => 'array'];
    }
}
