<?php

namespace App\Http\Controllers;

use App\Models\Legal;
use Inertia\Inertia;

class LegalController extends Controller
{
    public function index()
    {
        return Inertia::render('Legal', [
            'legal' => Legal::first(),
        ]);
    }
}
