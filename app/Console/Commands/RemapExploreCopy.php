<?php

namespace App\Console\Commands;

use App\Models\ExploreContentPage;
use Illuminate\Console\Command;

class RemapExploreCopy extends Command
{
    protected $signature = 'explore:remap-copy {old : Previous copy manifest path} {new : Updated copy manifest path}';
    protected $description = 'Carry existing editable texts over when source offsets change';

    public function handle(): int
    {
        $oldPath = $this->argument('old');
        $newPath = $this->argument('new');
        if (! is_file($oldPath) || ! is_file($newPath)) {
            $this->error('Both manifests are required');
            return self::FAILURE;
        }

        $old = json_decode((string) file_get_contents($oldPath), true, 512, JSON_THROW_ON_ERROR);
        $new = json_decode((string) file_get_contents($newPath), true, 512, JSON_THROW_ON_ERROR);
        $moved = 0;

        foreach (($old['pages'] ?? []) as $pageSlug => $oldEntries) {
            $newIndex = [];
            foreach (($new['pages'][$pageSlug] ?? []) as $entry) {
                $signature = hash('sha256', ($entry['source'] ?? '')."\0".($entry['text'] ?? ''));
                $newIndex[$signature][] = $entry['key'];
            }
            $offsets = [];
            $mapping = [];
            foreach ($oldEntries as $entry) {
                $signature = hash('sha256', ($entry['source'] ?? '')."\0".($entry['text'] ?? ''));
                $index = $offsets[$signature] ?? 0;
                $offsets[$signature] = $index + 1;
                $newKey = $newIndex[$signature][$index] ?? null;
                if ($newKey && $newKey !== $entry['key']) {
                    $mapping[$entry['key']] = $newKey;
                }
            }

            if (! $mapping) continue;
            $page = ExploreContentPage::query()->where('slug', $pageSlug)->first();
            if (! $page) continue;
            $copy = $page->copy ?? [];
            $changed = false;
            foreach ($mapping as $oldKey => $newKey) {
                // Preserve both keys, allowing the old bundle to continue working
                // after a code rollback. Never overwrite an existing new key.
                if (array_key_exists($oldKey, $copy) && ! array_key_exists($newKey, $copy)) {
                    $copy[$newKey] = $copy[$oldKey];
                    $changed = true;
                    $moved++;
                }
            }
            if ($changed) {
                $page->copy = $copy;
                $page->save();
            }
        }

        $this->info("Copied {$moved} editable texts to their updated keys.");
        return self::SUCCESS;
    }
}
