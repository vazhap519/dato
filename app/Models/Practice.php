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
        'content',
    ];

    protected $casts = [
        'content' => 'array',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('practice_image')->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('webp')
            ->format('webp')
            ->quality(85)
            ->nonQueued();
    }

    public function imageUrl(): ?string
    {
        $media = $this->getFirstMedia('practice_image');

        if (! $media) return null;

        return $media->hasGeneratedConversion('webp')
            ? $media->getUrl('webp')
            : $media->getUrl();
    }
}