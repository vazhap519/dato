<?php
/**
 * Read-only preflight before importing number meanings on a live server.
 * Usage: php scripts/preflight_number_meanings.php
 * Never prints database credentials or modifies records.
 */
declare(strict_types=1);

require dirname(__DIR__) . '/vendor/autoload.php';
$app = require dirname(__DIR__) . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\NumberMeaning;
use Illuminate\Support\Facades\Schema;

$requiredPhp = '8.4.0'; // composer.lock currently contains Symfony 8 dependencies
$phpOk = version_compare(PHP_VERSION, $requiredPhp, '>=');
$tableExists = Schema::hasTable('number_meanings');
$fields = ['number', 'title', 'symbolism', 'light_side', 'shadow_side', 'reflection_question', 'practice', 'is_published'];
$columnsOk = $tableExists && Schema::hasColumns('number_meanings', $fields);
$count = $tableExists ? NumberMeaning::query()->count() : null;
$numberCount = $tableExists ? NumberMeaning::query()->whereIn('number', array_map('strval', range(1, 999)))->count() : null;
$report = [
    'php_version' => PHP_VERSION,
    'php_compatible_with_current_lock' => $phpOk,
    'number_meanings_table_exists' => $tableExists,
    'required_columns_present' => $columnsOk,
    'existing_total_rows' => $count,
    'existing_rows_1_to_999' => $numberCount,
    'existing_content_requires_review_before_import' => ($numberCount ?? 0) > 0,
    'safe_to_proceed_automatically' => $phpOk && $columnsOk && $numberCount === 0,
];
echo json_encode($report, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), PHP_EOL;
exit(($phpOk && $columnsOk) ? 0 : 1);
