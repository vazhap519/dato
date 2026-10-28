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


    /**
     * Lightweight JSON endpoint for instant lookup. Preserve leading zeroes
     * in the displayed input, but resolve each group to its numeric meaning.
     */
    public function lookup(string $number)
    {
        $length = strlen($number);
        if ($length < 1 || $length > 12 || !ctype_digit($number)) {
            return response()->json(['message' => 'Некорректная последовательность'], 422);
        }

        $groups = [];
        $offset = 0;
        while ($offset < $length) {
            $remaining = $length - $offset;
            $size = $remaining <= 3 ? $remaining : ($remaining === 4 ? 2 : 3);
            $groups[] = substr($number, $offset, $size);
            $offset += $size;
        }

        $keys = array_values(array_unique(array_map(
            static fn (string $group): string => (string) (int) $group,
            $groups
        )));
        $meanings = NumberMeaning::query()
            ->where('is_published', true)
            ->whereIn('number', $keys)
            ->get(['number', 'title', 'symbolism', 'light_side', 'shadow_side', 'reflection_question', 'practice'])
            ->keyBy('number');

        return response()->json([
            'input' => $number,
            'groups' => array_map(static function (string $group) use ($meanings): array {
                $key = (string) (int) $group;
                return [
                    'digits' => $group,
                    'meaning' => $meanings->get($key),
                ];
            }, $groups),
        ]);
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
