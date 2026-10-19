<?php

namespace App\Http\Controllers;

use App\Models\ClosedGroup;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClosedGroupController extends Controller
{
    public function show($slug)
    {
        $group = ClosedGroup::where('slug', $slug)->firstOrFail();

        return Inertia::render('ClosedGroup', [
            'group' => $group,
            'review' => Review::first()?->only(['review_sm_header', 'review_xl_header', 'content']),
        ]);
    }
}
