<?php
/**
 * Read-only verification of the live Laravel database.
 * Run from project root after seeding:
 *   php scripts/verify_number_meanings.php
 */
declare(strict_types=1);
require dirname(__DIR__) . '/vendor/autoload.php';
$app = require dirname(__DIR__) . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\NumberMeaning;

$rows = NumberMeaning::query()
    ->whereIn('number', array_map('strval', range(1, 999)))
    ->get(['number','title','symbolism','light_side','shadow_side','reflection_question','practice','is_published']);

$byNumber = [];
$empty = [];
$generated = [];
$unpublished = [];
$prefixes = [
    'Число ', 'Иногда мы замечаем число в тот момент',
    'Представь это число не как указание судьбы',
    'Не нужно верить, что совпадение что-то предсказывает',
    'У чисел нет обязанности объяснять нашу жизнь',
    'Смысл здесь рождается не в цифрах',
    'Попробуй на мгновение оставить поиск тайного послания',
];
foreach ($rows as $row) {
    $n = (int)$row->number;
    $byNumber[$n] = ($byNumber[$n] ?? 0) + 1;
    foreach (['title','symbolism','light_side','shadow_side','reflection_question','practice'] as $field) {
        if (trim((string)$row->$field) === '') { $empty[] = "$n:$field"; }
    }
    foreach ($prefixes as $prefix) {
        if (str_starts_with((string)$row->symbolism, $prefix)) {
            $generated[] = $n;
            break;
        }
    }
    if (!$row->is_published) { $unpublished[] = $n; }
}
$missing = array_values(array_diff(range(1,999), array_keys($byNumber)));
$duplicates = array_filter($byNumber, static fn($count) => $count > 1);
$report = [
    'expected'=>999,
    'found_unique'=>count($byNumber),
    'missing'=>$missing,
    'duplicate_number_rows'=>$duplicates,
    'empty_fields'=>$empty,
    'remaining_generated_descriptions'=>array_values(array_unique($generated)),
    'unpublished_numbers'=>$unpublished,
];
echo json_encode($report, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT), PHP_EOL;
exit(($missing || $duplicates || $empty || $generated || $unpublished) ? 1 : 0);
