<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class HomeHero extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'badge_text',
        'title_line_1',
        'title_highlight',
        'subtitle',
        'primary_button_text',
        'primary_button_href',
        'secondary_button_text',
        'secondary_button_href',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('hero_image_url')->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        // ✅ conversion name = "webp"
        $this->addMediaConversion('webp')
            ->format('webp')
            ->quality(85)
            ->nonQueued();
    }

    public function heroImageUrl(): ?string
    {
        $media = $this->getFirstMedia('hero_image');

        if (! $media) {
            return null;
        }

        return $media->hasGeneratedConversion('webp')
            ? $media->getUrl('webp')
            : $media->getUrl();
    }
}
