<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia; // ✔ აუცილებელია
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Seo extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'page',
        'title',
        'description',
        'keywords',
        'canonical',
    ];

    protected $casts = [
        'keywords' => 'array',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('seo_image')->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('webp')
            ->format('webp')
            ->quality(85)
            ->nonQueued();
    }

    protected $appends = ['seo_image_url'];

    public function getSeoImageUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('seo_image', 'webp');
    }
    protected static function booted()
    {
        static::saved(function ($seo) {
            cache()->forget("seo_{$seo->page}");
        });

        static::deleted(function ($seo) {
            cache()->forget("seo_{$seo->page}");
        });
    }
}
