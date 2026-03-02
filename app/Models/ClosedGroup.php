<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class ClosedGroup extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'slug',
        'hero_badge',
        'hero_title',
        'hero_title_highlight',
        'hero_description',
        'hero_button_primary',
        'hero_button_secondary',
        'conditions',
        'promo_title',
        'description_title',
        'description_content',
        'program_title',
        'program',
        'author_name',
        'author_subtitle',
        'author_bio_1',
        'author_bio_2',
        'faq_title',
        'faq',
        'pricing_badge',
        'pricing_title',
        'pricing_old_price',
        'pricing_current_price',
        'pricing_button_text',
        'pricing_note',
        'pricing_features',
    ];

    protected $casts = [
        'conditions' => 'array',
        'program' => 'array',
        'faq' => 'array',
        'pricing_features' => 'array',
    ];

    /*
    |--------------------------------------------------------------------------
    | AUTO APPENDED MEDIA ATTRIBUTES
    |--------------------------------------------------------------------------
    */

    protected $appends = [
        'hero_image_url',
        'promo_image_url',
        'promo_video_url',
        'author_image_url',
    ];

    /*
    |--------------------------------------------------------------------------
    | MEDIA COLLECTIONS
    |--------------------------------------------------------------------------
    */

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('hero_image')->singleFile();
        $this->addMediaCollection('promo_image')->singleFile();
        $this->addMediaCollection('promo_video')->singleFile();
        $this->addMediaCollection('author_image')->singleFile();
    }

    /*
    |--------------------------------------------------------------------------
    | MEDIA ACCESSORS
    |--------------------------------------------------------------------------
    */

    public function getHeroImageUrlAttribute()
    {
        return $this->getFirstMediaUrl('hero_image', 'webp')
            ?: $this->getFirstMediaUrl('hero_image');
    }

    public function getPromoImageUrlAttribute()
    {
        return $this->getFirstMediaUrl('promo_image');
    }

    public function getPromoVideoUrlAttribute()
    {
        return $this->getFirstMediaUrl('promo_video');
    }

    public function getAuthorImageUrlAttribute()
    {
        return $this->getFirstMediaUrl('author_image', 'webp')
            ?: $this->getFirstMediaUrl('author_image');
    }
}
