<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Footer extends Model
{
    protected $fillable = [
        'brand_name',
        'navigation_links', 'bottom_tagline', 'cta_enabled', 'cta_badge', 'cta_title', 'cta_description', 'cta_button_text', 'cta_button_url',
'description',
'nav_title',
'support_title',
'support_faq',
'support_payment',
'support_privacy',
'support_offer',
'Contact_title',
'email',
'location',
'copyright',
'youtube',
'telegram',
'tiktok',
    ];

    protected $casts = ['cta_enabled' => 'boolean', 'navigation_links' => 'array'];
}
