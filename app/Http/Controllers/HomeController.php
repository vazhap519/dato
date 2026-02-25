<?php

namespace App\Http\Controllers;

use App\Models\ContactSection;
use App\Models\HomeAboutSection;
use App\Models\HomeHero;
use App\Models\Practice;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function home()
    {
        $hero = HomeHero::where('is_active', true)->first();
        $about = HomeAboutSection::where('is_active', true)->first();
        $practice = Practice::with([
            'contents' => function ($query) {
                $query->where('is_active', true);
            },
            'contents.media' // eager load media
        ])->first();
        $review = Review::first();
        $homeContact=ContactSection::first();
        $practice->getMedia('practice_images');
        return Inertia::render('Home', [
            'hero' => $hero ? [
                ...$hero->toArray(),
                'hero_image_url' => $hero->heroImageUrl(),
            ] : null,

            'about' => $about ? [
                ...$about->toArray(),
                'about_image_url' => $about->aboutImageUrl(),
            ] : null,
            'practiceSection' => $practice ? [
                'header_big'   => $practice->header_big,
                'header_small' => $practice->header_small,

                'content' => $practice->contents->map(function ($item) {

                    return [
                        'title'        => $item->title,
                        'description'  => $item->description,
                        'price'        => $item->price,
                        'telegram_url' => $item->telegram_url,
                        'is_premium'   => false, // თუ გინდა დაამატე ველი DB-ში

                        'image' => $item->getFirstMediaUrl('practice_images', 'webp')
                            ?: $item->getFirstMediaUrl('practice_images'),
                    ];
                })->values(),
            ] : null,

            'review' => $review ? [
                'review_sm_header' => $review->review_sm_header,
                'review_xl_header' => $review->review_xl_header,
                'content' => $review->content ?? [],
            ] : null,
            'contact' => $homeContact ? [
                'title' => $homeContact->title,
                'description' => $homeContact->description,
                'questions' => $homeContact->questions ?? [],
                'button_text' => $homeContact->button_text,
                'button_url' => $homeContact->button_url,
                'contact_image' => $homeContact->getFirstMediaUrl('contact_image', 'webp'),
            ] : null,
        ]);
    }

}
