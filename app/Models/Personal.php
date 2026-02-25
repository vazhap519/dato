<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Personal extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'hero_badge',
        'hero_title_line_1',
        'hero_title_highlight',
        'hero_title_line_2',
        'hero_description',
        'hero_primary_button_text',
        'hero_primary_button_url',
        'hero_secondary_button_text',
        'hero_secondary_button_url',
        'hero_author_name',
        'hero_author_role',

        'how_title_line_1',
        'how_title_highlight',
        'how_description',
        'how_items',

        'steps_title',
        'steps_subtitle',
        'steps_items',

        'pricing_title',
        'pricing_amount',
        'pricing_currency',
        'pricing_features',
        'pricing_button_text',
        'pricing_button_url',

        'faq_title',
        'faq_items',
    ];

    protected $casts = [
        'how_items' => 'array',
        'steps_items' => 'array',
        'pricing_features' => 'array',
        'faq_items' => 'array',
    ];

    /*
    |--------------------------------------------------------------------------
    | Media Collections
    |--------------------------------------------------------------------------
    */

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('hero_image')->singleFile();
        $this->addMediaCollection('steps_images');
    }

    /*
    |--------------------------------------------------------------------------
    | WebP Conversion
    |--------------------------------------------------------------------------
    */

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('webp')
            ->format('webp')
            ->quality(85)
            ->nonQueued(); // synchronous
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

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

    public function stepsImagesUrls(): array
    {
        return $this->getMedia('steps_images')->map(function ($media) {
            return $media->hasGeneratedConversion('webp')
                ? $media->getUrl('webp')
                : $media->getUrl();
        })->toArray();
    }
}
