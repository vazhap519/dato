<?php

namespace App\Console\Commands;

use App\Models\ExploreContentItem;
use App\Models\ExploreContentPage;
use App\Support\ExploreContent;
use Illuminate\Console\Command;

class ImportExploreContent extends Command
{
    protected $signature = 'explore:import-content {--force : Reset existing edits to original content}';
    protected $description = 'Import all existing self-discovery texts without overwriting edits';

    public function handle(): int
    {
        foreach (ExploreContent::PAGES as $slug => $title) {
            ExploreContentPage::firstOrCreate(['slug' => $slug], ['title' => $title, 'copy' => []]);
        }

        foreach (ExploreContent::DOCUMENTS as $document => $slug) {
            foreach (ExploreContent::sourceItems($document) as $item) {
                $identity = [
                    'document' => $document,
                    'group_key' => $item['group_key'],
                    'entry_key' => $item['entry_key'],
                ];
                $attributes = [
                    'page_slug' => $slug,
                    'title' => $item['title'],
                    'position' => $item['position'],
                    'payload' => $item['payload'],
                ];
                if ($this->option('force')) {
                    ExploreContentItem::updateOrCreate($identity, $attributes);
                } else {
                    ExploreContentItem::firstOrCreate($identity, $attributes);
                }
            }
            $this->info('Imported ' . $document);
        }

        return self::SUCCESS;
    }
}
