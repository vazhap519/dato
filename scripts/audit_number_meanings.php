<?php
/**
 * Read-only editorial audit, independent of the application database.
 * Run from project root: php scripts/audit_number_meanings.php
 * Exit 1 on missing numbers, overlapping definitions, or exact duplicate text.
 */
declare(strict_types=1);
$files = [
  'NumberMeaningSeeder.php',
  'EditorialNumberMeaningsSeeder.php',
  'EditorialNumberMeanings40to69Seeder.php',
  'EditorialNumberMeanings70to99Seeder.php',
  'EditorialNumberMeanings100to129Seeder.php',
  'EditorialNumberMeaningsGapFixSeeder.php',
  'EditorialNumberMeanings130to159Seeder.php',
  'EditorialNumberMeanings160to199Seeder.php',
  'EditorialNumberMeanings200to239Seeder.php',
  'EditorialNumberMeanings240to279Seeder.php',
  'EditorialNumberMeanings280to319Seeder.php',
  'EditorialNumberMeanings320to359Seeder.php',
  'EditorialNumberMeanings360to399Seeder.php',
  'EditorialNumberMeanings400to439Seeder.php',
  'EditorialNumberMeanings440to459Seeder.php',
  'EditorialNumberMeanings460to499Seeder.php',
  'EditorialNumberMeanings500to539Seeder.php',
  'EditorialNumberMeanings540to579Seeder.php',
  'EditorialNumberMeanings580to619Seeder.php',
  'EditorialNumberMeanings620to659Seeder.php',
  'EditorialNumberMeanings660to699Seeder.php',
  'EditorialNumberMeanings700to739Seeder.php',
  'EditorialNumberMeanings740to779Seeder.php',
  'EditorialNumberMeanings780to819Seeder.php',
  'EditorialNumberMeanings820to859Seeder.php',
  'EditorialNumberMeanings860to899Seeder.php',
  'EditorialNumberMeanings900to939Seeder.php',
  'EditorialNumberMeanings940to979Seeder.php',
  'EditorialNumberMeanings980to999Seeder.php'
];
$records = [];
$errors = [];
foreach ($files as $file) {
    $path = __DIR__ . '/../database/seeders/' . $file;
    if (!is_file($path)) { $errors[] = "Missing file: $file"; continue; }
    $source = file_get_contents($path);
    // Each authored entry consists of exactly seven PHP single-quoted strings.
    $quoted = "'((?:\\\\.|[^'\\\\])*)'";
    $pattern = '/\\[\\s*' . implode('\\s*,\\s*', array_fill(0, 7, $quoted)) . '\\s*\\]/u';
    preg_match_all($pattern, $source, $matches, PREG_SET_ORDER);
    if (!$matches) { $errors[] = "No seven-field editorial entries in $file"; }
    foreach ($matches as $match) {
        $fields = [];
        for ($i = 1; $i <= 7; $i++) { $fields[] = stripcslashes($match[$i]); }
        [$number,$title,$symbolism,$light,$shadow,$question,$practice] = $fields;
        if (!ctype_digit($number)) { $errors[] = "Invalid number in $file: $number"; continue; }
        $n = (int)$number;
        if ($n < 1 || $n > 999) { continue; } // curated values beyond 999 are intentionally outside scope
        foreach (array_slice($fields, 1) as $index => $value) {
            if (trim($value) === '') { $errors[] = "Empty field $index for $n in $file"; }
        }
        $records[$n][] = ['file'=>$file,'fields'=>$fields];
    }
}
$missing = [];
$overlap = [];
for ($n=1; $n<=999; $n++) {
    if (!isset($records[$n])) { $missing[] = $n; }
    elseif (count($records[$n]) !== 1) { $overlap[$n] = array_column($records[$n], 'file'); }
}
function normalizeText(string $text): string {
    $text = mb_strtolower($text, 'UTF-8');
    $text = preg_replace('/[^\\p{L}\\p{N}]+/u', ' ', $text);
    return trim(preg_replace('/\\s+/u', ' ', $text));
}
$fields = [1=>'title',2=>'symbolism',3=>'light_side',4=>'shadow_side',5=>'reflection_question',6=>'practice'];
$duplicates = [];
$similar = [];
foreach ($fields as $index=>$name) {
    $seen = [];
    $sets = [];
    foreach ($records as $number=>$versions) {
        foreach ($versions as $entry) {
            $value = normalizeText($entry['fields'][$index]);
            if ($value === '') { continue; }
            $seen[$value][] = $number;
            if (in_array($index, [2,5,6], true)) {
                $tokens = array_values(array_unique(preg_split('/\\s+/u', $value)));
                if (count($tokens) >= 9) { $sets[$number] = array_fill_keys($tokens, true); }
            }
        }
    }
    foreach ($seen as $value=>$numbers) {
        $numbers = array_values(array_unique($numbers));
        if (count($numbers)>1) { $duplicates[$name][] = $numbers; }
    }
    if (!in_array($index, [2,5,6], true)) { continue; }
    $keys = array_keys($sets);
    for ($a=0; $a<count($keys); $a++) {
        for ($b=$a+1; $b<count($keys); $b++) {
            $x=$sets[$keys[$a]]; $y=$sets[$keys[$b]];
            $common=count(array_intersect_key($x,$y));
            $union=count($x)+count($y)-$common;
            $score=$union ? $common/$union : 0;
            if ($score>=0.82) { $similar[$name][] = [$keys[$a],$keys[$b],round($score,3)]; }
        }
    }
}
$report = [
    'source_files'=>count($files),
    'distinct_numbers'=>count($records),
    'missing'=>$missing,
    'overlapping_definitions'=>$overlap,
    'exact_duplicate_text'=>$duplicates,
    'near_duplicate_candidates'=>$similar,
    'errors'=>$errors,
];
echo json_encode($report, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_INVALID_UTF8_SUBSTITUTE), PHP_EOL;
if ($missing || $overlap || $duplicates || $errors) { exit(1); }
