<?php

namespace App\Http\Controllers;

use App\Models\Editoria;
use Inertia\Inertia;

class EditoriaController extends Controller
{
    public function index()
    {
        $editoria = Editoria::first();

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
