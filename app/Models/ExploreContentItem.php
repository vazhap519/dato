<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExploreContentItem extends Model
{
    protected $fillable = [
        'page_slug', 'document', 'group_key', 'entry_key', 'title', 'position', 'payload',
    ];

    protected function casts(): array
    {
        return ['payload' => 'array', 'position' => 'integer'];
    }
}
