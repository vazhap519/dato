<?php

namespace App\Http\Controllers;

use App\Models\Editorial;
use Inertia\Inertia;

class EditorialController extends Controller
{
    public function index()
    {
        $editoria = Editorial::first();

        if (!$editoria) {
            return Inertia::render('Editoria', [
                'editoria' => null,
            ]);
        }

        return Inertia::render('Editoria', [
            'editoria' => [
                ...$editoria->toArray(),

                // Normalize repeater arrays to pure string arrays
                'for_whom_list' => collect($editoria->for_whom_list)
                    ->map(fn ($item) => is_array($item) ? ($item['text'] ?? '') : $item)
                    ->values(),

                'author_points' => collect($editoria->author_points)
                    ->map(fn ($item) => is_array($item) ? ($item['text'] ?? '') : $item)
                    ->values(),

                // Media URLs
                'hero_image_url'     => $editoria->heroImageUrl(),
                'for_whom_image_url' => $editoria->forWhomImageUrl(),
                'author_image_url'   => $editoria->authorImageUrl(),
            ],
        ]);
    }
}
