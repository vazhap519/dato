<?php

namespace App\Http\Controllers;

use App\Models\Practice;
use Inertia\Inertia;

class PracticeController extends Controller
{
    public function index()
    {
        $practice = Practice::with([
            'contents' => function ($query) {
                $query->where('is_active', true);
            },
            'contents.media'
        ])->first();

        return Inertia::render('Practice', [
            'practiceSection' => $practice ? [
                'header_big'   => $practice->header_big,
                'header_small' => $practice->header_small,

                'content' => $practice->contents->map(function ($item) {
                    return [
                        'title'        => $item->title,
                        'description'  => $item->description,
                        'price'        => $item->price,
                        'telegram_url' => $item->telegram_url,

                        'image' => $item->getFirstMediaUrl('practice_images', 'webp')
                            ?: $item->getFirstMediaUrl('practice_images'),
                    ];
                })->values(),
            ] : null,
        ]);
    }
}
