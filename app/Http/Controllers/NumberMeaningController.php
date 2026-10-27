<?php
namespace App\Http\Controllers;
use App\Models\NumberMeaning;
use Inertia\Inertia;
class NumberMeaningController extends Controller {
    public function index() {
        return Inertia::render('Numbers', [
            'featured' => NumberMeaning::query()->where('is_published', true)->orderBy('number')->get(['number','title']),
            'selected' => null,
        ]);
    }
    public function show(string $number) {
        $meaning = NumberMeaning::query()->where('number',$number)->where('is_published',true)->first();
        return Inertia::render('Numbers', [
            'featured' => NumberMeaning::query()->where('is_published',true)->orderBy('number')->get(['number','title']),
            'selected' => $meaning,
            'searched' => $number,
        ]);
    }
}
