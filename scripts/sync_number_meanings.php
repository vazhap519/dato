<?php
/**
 * Guarded editorial synchronization. DEFAULT: DRY RUN ONLY.
 *
 * php scripts/sync_number_meanings.php /root/backups/number-meanings/before-update-....json /tmp/expected-number-meanings.json
 *
 * To apply later, an explicit --apply flag and --confirm=... are required.
 * Do not apply before reviewing the dry run and obtaining owner approval.
 */
declare(strict_types=1);
require dirname(__DIR__) . '/vendor/autoload.php';
$app = require dirname(__DIR__) . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\NumberMeaning;
use Illuminate\Support\Facades\DB;

$backupPath = $argv[1] ?? '';
$expectedPath = $argv[2] ?? '';
$apply = in_array('--apply', $argv, true);
$confirmation = 'I_APPROVE_REPLACING_REVIEWED_NUMBER_MEANINGS';
if (!is_file($backupPath) || !str_starts_with(realpath($backupPath), '/root/backups/number-meanings/')) {
    fwrite(STDERR, "A verified backup path under /root/backups/number-meanings/ is required.\n");
    exit(2);
}
if (!is_file($expectedPath) || !str_starts_with(realpath($expectedPath), '/tmp/')) {
    fwrite(STDERR, "Expected editorial JSON under /tmp/ is required.\n");
    exit(2);
}
if ($apply && !in_array('--confirm=' . $confirmation, $argv, true)) {
    fwrite(STDERR, "Explicit confirmation required; nothing changed.\n");
    exit(2);
}
try {
    $backup = json_decode(file_get_contents($backupPath), true, 512, JSON_THROW_ON_ERROR);
    $expected = json_decode(file_get_contents($expectedPath), true, 512, JSON_THROW_ON_ERROR);
    $fields = ['title', 'symbolism', 'light_side', 'shadow_side', 'reflection_question', 'practice'];
    if (!is_array($backup) || count($backup) !== 1007 || !is_array($expected) || count($expected) !== 999) {
        throw new RuntimeException('Unexpected backup or editorial record count.');
    }
    $snapshot = [];
    foreach ($backup as $row) {
        if (!isset($row['number']) || isset($snapshot[(string) $row['number']])) {
            throw new RuntimeException('Invalid or duplicate backup number.');
        }
        $snapshot[(string) $row['number']] = $row;
    }
    foreach (range(1, 999) as $n) {
        if (!isset($snapshot[(string) $n], $expected[(string) $n])) {
            throw new RuntimeException("Missing number $n in backup or editorial source.");
        }
        foreach ($fields as $field) {
            if (!array_key_exists($field, $expected[(string) $n])) {
                throw new RuntimeException("Missing editorial field $field for $n.");
            }
        }
    }
    $run = function () use ($snapshot, $expected, $fields, $apply): array {
        $rows = NumberMeaning::query()->lockForUpdate()->get();
        if ($rows->count() !== count($snapshot)) {
            throw new RuntimeException('Live row count changed since backup. Aborting.');
        }
        $changed = [];
        $unchanged = 0;
        foreach ($rows as $row) {
            $n = (string) $row->number;
            if (!isset($snapshot[$n])) {
                throw new RuntimeException("Unexpected live number $n. Aborting.");
            }
            $old = $snapshot[$n];
            foreach (['id', 'number', 'title', 'symbolism', 'light_side', 'shadow_side', 'reflection_question', 'practice', 'is_published', 'created_at', 'updated_at'] as $field) {
                $liveValue = in_array($field, ['created_at', 'updated_at'], true) ? ($row->{$field}?->toISOString() ?? '') : (string) ($row->{$field} ?? '');
                $backupValue = in_array($field, ['created_at', 'updated_at'], true) ? (isset($old[$field]) ? \Carbon\Carbon::parse($old[$field])->toISOString() : '') : (string) ($old[$field] ?? '');
                if ($liveValue !== $backupValue) {
                    throw new RuntimeException("Live row $n changed since backup ($field). Aborting.");
                }
            }
            if (!isset($expected[$n])) {
                continue; // Preserve all 8 additional numbers.
            }
            $diff = [];
            foreach ($fields as $field) {
                if ((string) ($row->{$field} ?? '') !== (string) ($expected[$n][$field] ?? '')) {
                    $diff[$field] = $expected[$n][$field];
                }
            }
            if (!$diff) {
                $unchanged++;
                continue;
            }
            $changed[$n] = array_keys($diff);
            if ($apply) {
                $row->update($diff);
            }
        }
        ksort($changed, SORT_NUMERIC);
        return [
            'mode' => $apply ? 'APPLIED' : 'DRY_RUN_NO_WRITES',
            'backup_verified_against_live_database' => true,
            'unchanged_numbers' => $unchanged,
            'changed_numbers' => count($changed),
            'extra_numbers_preserved' => count($snapshot) - 999,
            'changed_fields_by_number' => $changed,
            'warning' => 'Backup equality detects changes since backup, not manual edits made before it. Owner must review before apply.',
        ];
    };
    if ($apply) {
        $result = DB::transaction($run, 3);
    } else {
        // Locking isn't necessary for dry-run; still use a read transaction for consistency.
        $result = DB::transaction($run, 1);
    }
    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR), PHP_EOL;
} catch (Throwable $e) {
    fwrite(STDERR, 'ABORTED: ' . $e->getMessage() . PHP_EOL);
    exit(1);
}
