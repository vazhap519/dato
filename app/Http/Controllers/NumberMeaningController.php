<?php
namespace App\Http\Controllers;

use App\Models\NumberMeaning;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NumberMeaningController extends Controller
{
    private const SPECIAL = ['11','22','33','44','55','111','222','333','444','555','666','777','888','999','1010','1111','1212','1234','2020','2222','2323'];

    private function catalog(Request $request): array
    {
        $page = max(1, min(10, (int) $request->query('page', 1)));
        $start = ($page - 1) * 100 + 1;
        $end = min(999, $start + 99);
        $range = array_map('strval', range($start, $end));
        $query = NumberMeaning::query()->where('is_published', true);
        $items = (clone $query)->whereIn('number', $range)->get(['number','title'])->keyBy('number');
        $ordinary = [];
        foreach ($range as $number) {
            if (!in_array($number, self::SPECIAL, true) && isset($items[$number])) {
                $ordinary[] = $items[$number];
            }
        }

        $specialItems = (clone $query)->whereIn('number', self::SPECIAL)->get(['number','title'])->keyBy('number');
        $special = [];
        foreach (self::SPECIAL as $number) {
            if (isset($specialItems[$number])) {
                $special[] = $specialItems[$number];
            }
        }
        return ['special' => $special, 'ordinary' => $ordinary, 'catalogPage' => $page, 'catalogPages' => 10];
    }

    public function index(Request $request)
    {
        return Inertia::render('Numbers', [
            ...$this->catalog($request),
            'selected' => null,
        ]);
    }

    public function show(Request $request, string $number)
    {
        $meaning = NumberMeaning::query()->where('number', $number)->where('is_published', true)->first();
        return Inertia::render('Numbers', [
            ...$this->catalog($request),
            'selected' => $meaning,
            'searched' => $number,
        ]);
    }
}
