<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Editoria extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [

        'hero_badge',
        'hero_title',
        'hero_description',
        'hero_button_text',
        'hero_button_url',

        'quote_text',
        'quote_button_text',

        'info_blocks',
        'program_days',

        'for_whom_title',
        'for_whom_description',
        'for_whom_list',

        'why_title',
        'why_description',
        'why_button_text',

        'author_name',
        'author_quote',
        'author_points',
        'author_button_text',

        'cta_title',
        'cta_description',
        'cta_button_text',
    ];

    protected $casts = [
        'info_blocks' => 'array',
        'program_days' => 'array',
        'for_whom_list' => 'array',
        'author_points' => 'array',
    ];

    /*
    |--------------------------------------------------------------------------
    | Media Collections
    |--------------------------------------------------------------------------
    */

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('hero_image')->singleFile();
        $this->addMediaCollection('for_whom_image')->singleFile();
        $this->addMediaCollection('author_image')->singleFile();
    }

    /*
    |--------------------------------------------------------------------------
    | Media Conversions
    |--------------------------------------------------------------------------
    */

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('webp')
            ->format('webp')
            ->quality(85)
            ->nonQueued();
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function heroImageUrl(): ?string
    {
        return $this->getFirstMediaUrl('hero_image', 'webp')
            ?: $this->getFirstMediaUrl('hero_image');
    }

    public function forWhomImageUrl(): ?string
    {
        return $this->getFirstMediaUrl('for_whom_image', 'webp')
            ?: $this->getFirstMediaUrl('for_whom_image');
    }

    public function authorImageUrl(): ?string
    {
        return $this->getFirstMediaUrl('author_image', 'webp')
            ?: $this->getFirstMediaUrl('author_image');
    }
}
