<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class HomeAboutSection extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'kicker',
        'title',
        'paragraph_1',
        'paragraph_2',
        'stat_1_value',
        'stat_1_label',
        'stat_2_value',
        'stat_2_label',
        'stat_3_value',
        'stat_3_label',
        'is_active'
    ];

    /**
     * About image collection
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('about_image')->singleFile();
    }

    /**
     * WebP conversion
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('webp')
            ->format('webp')
            ->quality(85)
            ->nonQueued();
    }

    /**
     * Get image url (webp if available)
     */
    public function aboutImageUrl(): ?string
    {
        $media = $this->getFirstMedia('about_image');

        if (! $media) {
            return null;
        }

        return $media->hasGeneratedConversion('webp')
            ? $media->getUrl('webp')
            : $media->getUrl();
    }
}
