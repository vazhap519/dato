<?php

namespace App\Console\Commands;

use App\Models\ExploreContentItem;
use App\Models\ExploreContentPage;
use Illuminate\Console\Command;

class ImportExploreContent extends Command
{
    protected $signature = 'explore:import-content {--force : Replace existing edits with source JSON}';
    protected $description = 'Import self-discovery content without overwriting administrator changes';

    public function handle(): int
    {
        $sources = [
            'archetypes' => ['archetype-guides.json', 'archetype-situations.json', 'archetype-mirror-questions.json'],
            'emotions' => ['emotion-atlas.json', 'emotion-practices.json', 'emotion-situations.json'],
            'dreams' => ['dream-atlas.json'],
            'patterns' => ['pattern-atlas.json'],
            'mirror' => ['personality-mirror.json'],
        ];

        foreach ($sources as $slug => $documents) {
            foreach ($documents as $filename) {
                $path = resource_path('data/' . $filename);
                if (! is_file($path)) {
                    $this->warn("Missing: {$filename}");
                    continue;
                }
                $document = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
                $documentKey = pathinfo($filename, PATHINFO_FILENAME);
                $copy = [];
                foreach ($document as $group => $value) {
                    if (! is_array($value) || ! array_is_list($value) || ! collect($value)->contains(fn ($v) => is_array($v))) {
                        $copy[$group] = $value;
                        continue;
                    }
                    foreach ($value as $position => $entry) {
                        if (! is_array($entry)) continue;
                        $key = (string) ($entry['slug'] ?? $entry['id'] ?? $entry['key'] ?? $position);
                        $identity = ['document' => $documentKey, 'group_key' => $group, 'entry_key' => $key];
                        $attributes = [
                            'page_slug' => $slug,
                            'title' => (string) ($entry['title'] ?? $entry['name'] ?? $entry['text'] ?? $key),
                            'position' => $position,
                            'payload' => $entry,
                        ];
                        if ($this->option('force')) ExploreContentItem::updateOrCreate($identity, $attributes);
                        else ExploreContentItem::firstOrCreate($identity, $attributes);
                    }
                }
                $attributes = ['title' => $documentKey, 'copy' => $copy];
                $pageKey = $slug . ':' . $documentKey;
                if ($this->option('force')) ExploreContentPage::updateOrCreate(['slug' => $pageKey], $attributes);
                else ExploreContentPage::firstOrCreate(['slug' => $pageKey], $attributes);
                $this->info("Imported {$filename}");
            }
        }
        return self::SUCCESS;
    }
}
