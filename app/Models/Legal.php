<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Legal extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'download_button_text',

        'sections_nav',

        'privacy_title',
        'privacy_content',

        'agreement_title',
        'agreement_content',

        'offer_title',
        'offer_content',

        'details_title',
        'company_details',

        'cta_title',
        'cta_description',
        'cta_button_text',
    ];

    protected $casts = [
        'sections_nav' => 'array',
        'company_details' => 'array',
    ];
}
