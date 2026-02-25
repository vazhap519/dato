<?php

namespace App\Http\Controllers;

use App\Models\Personal;
use Inertia\Inertia;

class PersonalController extends Controller
{
    public function index()
    {
        $personal = Personal::first();

        if (! $personal) {
            return Inertia::render('Personal', [
                'Personal' => null,
            ]);
        }

        return Inertia::render('Personal', [
            'personal' => [
                // HERO
                'hero_badge' => $personal->hero_badge,
                'hero_title_line_1' => $personal->hero_title_line_1,
                'hero_title_highlight' => $personal->hero_title_highlight,
                'hero_title_line_2' => $personal->hero_title_line_2,
                'hero_description' => $personal->hero_description,
                'hero_primary_button_text' => $personal->hero_primary_button_text,
                'hero_primary_button_url' => $personal->hero_primary_button_url,
                'hero_secondary_button_text' => $personal->hero_secondary_button_text,
                'hero_secondary_button_url' => $personal->hero_secondary_button_url,
                'hero_author_name' => $personal->hero_author_name,
                'hero_author_role' => $personal->hero_author_role,
                'hero_image' => $personal->heroImageUrl(),

                // HOW
                'how_title_line_1' => $personal->how_title_line_1,
                'how_title_highlight' => $personal->how_title_highlight,
                'how_description' => $personal->how_description,
                'how_items' => $personal->how_items ?? [],

                // STEPS
                'steps_title' => $personal->steps_title,
                'steps_subtitle' => $personal->steps_subtitle,
                'steps_items' => $personal->steps_items ?? [],
                'steps_images' => $personal->stepsImagesUrls(),

                // PRICING
                'pricing_title' => $personal->pricing_title,
                'pricing_amount' => $personal->pricing_amount,
                'pricing_currency' => $personal->pricing_currency,
                'pricing_features' => $personal->pricing_features ?? [],
                'pricing_button_text' => $personal->pricing_button_text,
                'pricing_button_url' => $personal->pricing_button_url,

                // FAQ
                'faq_title' => $personal->faq_title,
                'faq_items' => $personal->faq_items ?? [],
            ],
        ]);
    }
}
