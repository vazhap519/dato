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
        $this->addMediaCollection('u_image')->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        // ✅ conversion name = "webp"
        $this->addMediaConversion('webp')
            ->format('webp')
            ->quality(85)
            ->nonQueued();
    }

    public function UImageUrl(): ?string
    {
        $media = $this->getFirstMedia('u_image');

        if (! $media) {
            return null;
        }

        // ✅ conversion თუ არსებობს — webp, თუ არა — original
        return $media->hasGeneratedConversion('webp')
            ? $media->getUrl('webp')
            : $media->getUrl();
    }
}
