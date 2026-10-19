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
        'header_small', 'free_enabled', 'free_title', 'free_description', 'free_button_text', 'free_button_url', 'start_enabled', 'start_badge', 'start_title', 'start_description', 'start_steps', 'start_note', 'start_button_text', 'start_button_url',
    ];

    protected $casts = ['free_enabled' => 'boolean', 'start_enabled' => 'boolean', 'start_steps' => 'array'];

    public function contents()
    {
        return $this->hasMany(PracticeContent::class);
    }


}
