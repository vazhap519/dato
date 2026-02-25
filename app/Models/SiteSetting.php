<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class SiteSetting extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'site_name',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('favicon')->singleFile();
        $this->addMediaCollection('apple_icon')->singleFile();
        $this->addMediaCollection('og_default')->singleFile();
    }

    protected $appends = [
        'favicon_url',
        'apple_icon_url',
    ];

    public function getFaviconUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('favicon');
    }

    public function getAppleIconUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('apple_icon');
    }
    protected static function booted()
    {
        static::saved(function () {
            cache()->forget('site_settings');
        });

        static::deleted(function () {
            cache()->forget('site_settings');
        });
    }
}
