<?php
/**
 * READ-ONLY comparison of authored 1–999 meanings against the current database.
 * Run: php scripts/compare_number_meanings.php
 * Does not modify any database row, migration, or .env.
 * IMPORTANT: Differences are NOT proof that a database value is safe to overwrite.
 */
declare(strict_types=1);

require dirname(__DIR__) . '/vendor/autoload.php';
$app = require dirname(__DIR__) . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\NumberMeaning;

$coordinator = file_get_contents(dirname(__DIR__) . '/database/seeders/AllEditorialNumberMeaningsSeeder.php');
preg_match_all('/\b([A-Za-z][A-Za-z0-9]*Seeder)::class/', $coordinator, $classes);
$fields = ['title', 'symbolism', 'light_side', 'shadow_side', 'reflection_question', 'practice'];
$expected = [];
$conflicts = [];
$sourceErrors = [];
$quoted = "'((?:\\\\.|[^'\\\\])*)'";
$pattern = '/\[\s*' . implode('\s*,\s*', array_fill(0, 7, $quoted)) . '\s*\]/u';

foreach (array_unique($classes[1]) as $class) {
    // The generic and intermediate seeders generate content programmatically.
    // Every final editorial entry must be present as a literal seven-field array.
    if (in_array($class, ['AllNumbersSeeder', 'RefineNumberMeaningsSeeder'], true)) {
        continue;
    }
    $path = dirname(__DIR__) . '/database/seeders/' . $class . '.php';
    if (!is_file($path)) {
        $sourceErrors[] = "Missing source: $class";
        continue;
    }
    preg_match_all($pattern, file_get_contents($path), $matches, PREG_SET_ORDER);
    foreach ($matches as $match) {
        $values = [];
        for ($i = 1; $i <= 7; $i++) {
            $values[] = stripcslashes($match[$i]);
        }
        if (!ctype_digit($values[0])) {
            continue;
        }
        $number = (int) $values[0];
        if ($number < 1 || $number > 999) {
            continue;
        }
        if (isset($expected[$number])) {
            $conflicts[] = $number;
        }
        $expected[$number] = array_combine($fields, array_slice($values, 1));
    }
}

$missingSource = array_values(array_diff(range(1, 999), array_keys($expected)));
if ($missingSource || $conflicts || $sourceErrors) {
    fwrite(STDERR, json_encode([
        'error' => 'Editorial source is incomplete or ambiguous; comparison aborted',
        'missing_source_numbers' => $missingSource,
        'conflicts' => $conflicts,
        'source_errors' => $sourceErrors,
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . PHP_EOL);
    exit(1);
}

$actual = NumberMeaning::query()
    ->whereIn('number', array_map('strval', range(1, 999)))
    ->get()
    ->keyBy(fn ($row) => (int) $row->number);

$differences = [];
$byField = array_fill_keys($fields, 0);
$unchanged = 0;
$missingDatabase = [];
foreach ($expected as $number => $authored) {
    $row = $actual->get($number);
    if (!$row) {
        $missingDatabase[] = $number;
        continue;
    }
    $changed = [];
    foreach ($fields as $field) {
        if ((string) ($row->{$field} ?? '') !== (string) $authored[$field]) {
            $changed[] = $field;
            $byField[$field]++;
        }
    }
    if ($changed) {
        $differences[(string) $number] = $changed;
    } else {
        $unchanged++;
    }
}
ksort($differences, SORT_NUMERIC);
$report = [
    'mode' => 'READ_ONLY_NO_WRITES',
    'source_numbers' => count($expected),
    'database_numbers_1_to_999' => $actual->count(),
    'unchanged_numbers' => $unchanged,
    'different_numbers' => count($differences),
    'missing_database_numbers' => $missingDatabase,
    'changed_fields_count' => $byField,
    'differences_by_number' => $differences,
    'warning' => 'This report cannot distinguish older editorial text from manual edits. Never overwrite all differences automatically.',
];
echo json_encode($report, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_INVALID_UTF8_SUBSTITUTE), PHP_EOL;
