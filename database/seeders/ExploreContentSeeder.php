<?php

namespace Database\Seeders;

use App\Models\ExploreContentItem;
use App\Models\ExploreContentPage;
use App\Support\ExploreContent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ExploreContentSeeder extends Seeder
{
    /**
     * Never overwrite an existing editor's changes. Every field is populated
     * with its current production text when first created.
     */
    public function run(): void
    {
        $file = resource_path('data/explore-copy-manifest.json');

        if (! is_file($file)) {
            throw new RuntimeException('Нет манифеста текстов. Сначала выполни node scripts/generate-explore-copy-manifest.cjs');
        }

        $manifest = json_decode((string) file_get_contents($file), true);
        if (! is_array($manifest) || empty($manifest['pages'])) {
            throw new RuntimeException('Некорректный манифест текстов');
        }

        DB::transaction(function () use ($manifest): void {
            foreach (ExploreContent::PAGES as $slug => $title) {
                $defaults = [];
                foreach ($manifest['pages'][$slug] ?? [] as $entry) {
                    $defaults[$entry['key']] = $entry['text'];
                }

                $page = ExploreContentPage::query()->firstOrCreate(
                    ['slug' => $slug],
                    ['title' => $title, 'copy' => $defaults],
                );
                $merged = $page->copy ?? [];
                $changed = false;

                foreach ($defaults as $key => $value) {
                    if (! array_key_exists($key, $merged)) {
                        $merged[$key] = $value;
                        $changed = true;
                    }
                }
                if ($changed) {
                    $page->copy = $merged;
                    $page->save();
                }
            }

            foreach (ExploreContent::DOCUMENTS as $document => $pageSlug) {
                foreach (ExploreContent::sourceItems($document) as $item) {
                    $record = ExploreContentItem::query()->firstOrCreate(
                        [
                            'document' => $document,
                            'group_key' => $item['group_key'],
                            'entry_key' => $item['entry_key'],
                        ],
                        [
                            'page_slug' => $pageSlug,
                            'position' => $item['position'],
                            'title' => $item['title'],
                            'payload' => $item['payload'],
                        ],
                    );

                    // Add newly introduced fields while keeping all text edits.
                    $existing = $record->payload ?? [];
                    $merged = array_replace_recursive($item['payload'], $existing);
                    if ($merged !== $existing) {
                        $record->payload = $merged;
                        $record->save();
                    }
                }
            }
        });

        $pages = ExploreContentPage::query()->count();
        $items = ExploreContentItem::query()->count();
        $this->command?->info("Редактор самопознания: {$pages} страниц/общих блоков, {$items} материалов. Текущие тексты сохранены.");
    }
}
