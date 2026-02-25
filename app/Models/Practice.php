<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Practice extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'header_big',
        'header_small',
    ];

    public function contents()
    {
        return $this->hasMany(PracticeContent::class);
    }


}
