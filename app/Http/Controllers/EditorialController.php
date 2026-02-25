<?php

namespace App\Http\Controllers;


use App\Models\Editorial;
use Inertia\Inertia;

class EditorialController extends Controller
{
    public function index()
    {
        $editoria = Editorial::first();

        return Inertia::render('Editoria', [
            'editoria' => $editoria ? [
                ...$editoria->toArray(),

                // Media URLs
                'hero_image_url'      => $editoria->heroImageUrl(),
                'for_whom_image_url'  => $editoria->forWhomImageUrl(),
                'author_image_url'    => $editoria->authorImageUrl(),

            ] : null,
        ]);
    }
}
