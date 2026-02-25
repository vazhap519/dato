<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class PracticeContent extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'practice_id',
        'title',
        'description',
        'price',
        'telegram_url',
        'is_active',
    ];

    public function practice()
    {
        return $this->belongsTo(Practice::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('practice_images')
            ->singleFile(); // თითო კონტენტზე 1 ფოტო
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('webp')
            ->format('webp')
            ->quality(85)
            ->nonQueued();
    }
}
