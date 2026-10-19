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
                $query->where('is_active', true)->limit(2);
            },
            'contents.media', // eager load media
            'contents.closedGroup'
        ])->first();
        $review = Review::first();
        $homeContact=ContactSection::first();
        // $practice->getMedia('practice_images');
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
                'free_enabled' => $practice->free_enabled,
                'free_title' => $practice->free_title,
                'free_description' => $practice->free_description,
                'free_button_text' => $practice->free_button_text,
                'free_button_url' => $practice->free_button_url,
                'start_enabled' => $practice->start_enabled,
                'start_badge' => $practice->start_badge,
                'start_title' => $practice->start_title,
                'start_description' => $practice->start_description,
                'start_steps' => $practice->start_steps,
                'start_note' => $practice->start_note,
                'start_button_text' => $practice->start_button_text,
                'start_button_url' => $practice->start_button_url,
                'free_image' => $practice->getFirstMediaUrl('free_image'),

                'content' => $practice->contents->map(function ($item) {

                    return [
                        'title'        => $item->title,
                        'description'  => $item->description,
                        'price'        => $item->price,
                        'is_premium'   => false, // თუ გინდა დაამატე ველი DB-ში
                        'slug' => optional($item->closedGroup)->slug,
                        'url' => $item->product_type === 'personal'
                            ? route('personal')
                            : (optional($item->closedGroup)->slug
                                ? route('closed-group.show', ['slug' => $item->closedGroup->slug])
                                : null),
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
