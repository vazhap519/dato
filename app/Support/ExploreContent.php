<?php

namespace App\Support;

use App\Models\ExploreContentItem;
use App\Models\ExploreContentPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Throwable;

/**
 * Database overrides for editorial copy and structured self-discovery libraries.
 *
 * Every document starts with the existing JSON source of truth. The CMS only
 * overlays editable fields from existing items; structure, order and stable
 * identifiers are retained to protect scoring, links and statistics.
 */
final class ExploreContent
{
    public const PAGES = [
        'numbers' => 'Язык чисел',
        'emotions' => 'Язык эмоций',
        'archetypes' => 'Язык архетипов',
        'dreams' => 'Язык снов',
        'patterns' => 'Язык повторений',
        'mirror' => 'Зеркало личности',
        'relationships' => 'Язык отношений',
        'body' => 'Язык тела',
        'choice' => 'Язык выбора',
        'beliefs' => 'Язык убеждений',
        'values' => 'Язык ценностей',
        'shared' => 'Общие элементы направлений самопознания',
    ];

    public const DOCUMENTS = [
        'emotion-atlas' => 'emotions',
        'emotion-situations' => 'emotions',
        'emotion-practices' => 'emotions',
        'archetype-guides' => 'archetypes',
        'archetype-situations' => 'archetypes',
        'archetype-mirror-questions' => 'archetypes',
        'dream-atlas' => 'dreams',
        'pattern-atlas' => 'patterns',
        'personality-mirror' => 'mirror',
        'relationships-atlas' => 'relationships',
        'body-atlas' => 'body',
        'choice-atlas' => 'choice',
        'beliefs-atlas' => 'beliefs',
        'values-atlas' => 'values',
    ];

    public static function pageSlug(Request $request): ?string
    {
        $name = (string) $request->route()?->getName();

        if (str_starts_with($name, 'numbers.')) {
            return 'numbers';
        }
        foreach (['emotions', 'archetypes', 'dreams', 'patterns', 'mirror', 'relationships', 'body', 'choice', 'beliefs', 'values'] as $slug) {
            if (str_starts_with($name, 'explore.'.$slug)) {
                return $slug;
            }
        }

        return null;
    }

    public static function publicProps(Request $request): array
    {
        $slug = self::pageSlug($request);
        if ($slug === null) {
            return ['copy' => [], 'documents' => []];
        }

        try {
            if (! Schema::hasTable('explore_content_pages')) {
                return ['copy' => [], 'documents' => []];
            }

            $pages = ExploreContentPage::query()
                ->whereIn('slug', [$slug, 'shared'])
                ->get(['slug', 'copy'])
                ->keyBy('slug');

            $copy = array_replace(
                $pages->get('shared')?->copy ?? [],
                $pages->get($slug)?->copy ?? [],
            );

            $keys = array_keys(array_filter(self::DOCUMENTS, fn (string $page) => $page === $slug));
            $documents = [];

            if ($keys !== [] && Schema::hasTable('explore_content_items')) {
                $overrides = ExploreContentItem::query()
                    ->whereIn('document', $keys)
                    ->orderBy('position')
                    ->get()
                    ->groupBy('document');
                foreach ($keys as $key) {
                    $documents[$key] = self::buildDocument($key, $overrides->get($key)?->all() ?? []);
                }
            }

            return ['copy' => $copy, 'documents' => $documents];
        } catch (Throwable $exception) {
            // A not-yet-applied CMS migration must never take the public site down.
            report($exception);

            return ['copy' => [], 'documents' => []];
        }
    }

    public static function defaultDocument(string $document): array
    {
        if (! isset(self::DOCUMENTS[$document])) {
            return [];
        }

        $file = resource_path('data/'.$document.'.json');
        if (! is_file($file)) {
            return [];
        }

        return json_decode((string) file_get_contents($file), true) ?: [];
    }

    /**
     * Split original document into editable records. Each row is small enough
     * to have its own simple Filament edit page.
     */
    public static function sourceItems(string $document): array
    {
        $source = self::defaultDocument($document);
        $items = [];
        $meta = [];

        foreach ($source as $group => $values) {
            if (! is_array($values)) {
                $meta[$group] = $values;
                continue;
            }

            if (array_is_list($values)) {
                foreach ($values as $index => $value) {
                    $row = is_array($value) ? $value : ['value' => $value];
                    $id = (string) ($row['slug'] ?? $row['id'] ?? 'index-'.$index);
                    $title = (string) ($row['name'] ?? $row['title'] ?? $row['topic']
                        ?? $row['statement'] ?? $row['text'] ?? $row['value']
                        ?? (($group === 'questions' ? 'Вопрос ' : 'Элемент ').($index + 1)));
                    $items[] = [
                        'group_key' => $group,
                        'entry_key' => $id,
                        'position' => $index,
                        'title' => mb_substr($title, 0, 250),
                        'payload' => $row,
                    ];
                }
            } else {
                foreach ($values as $key => $value) {
                    $items[] = [
                        'group_key' => $group,
                        'entry_key' => (string) $key,
                        'position' => count($items),
                        'title' => ucfirst(str_replace(['-', '_'], ' ', (string) $key)),
                        'payload' => is_array($value) ? $value : ['value' => $value],
                    ];
                }
            }
        }

        if ($meta !== []) {
            $items[] = [
                'group_key' => '_meta',
                'entry_key' => '_meta',
                'position' => 0,
                'title' => 'Общие пояснения документа',
                'payload' => $meta,
            ];
        }

        return $items;
    }

    /**
     * The order and count of questions and options are immutable.
     * Technical identifiers come from the original JSON, never from editors.
     */
    public static function buildDocument(string $document, array $records): array
    {
        $source = self::defaultDocument($document);
        $lookup = [];

        foreach ($records as $record) {
            $lookup[$record->group_key][$record->entry_key] = $record->payload;
        }

        foreach ($source as $group => &$values) {
            if (! is_array($values)) {
                if (isset($lookup['_meta']['_meta'][$group]) && $group !== 'version') {
                    $values = $lookup['_meta']['_meta'][$group];
                }
                continue;
            }

            if (array_is_list($values)) {
                foreach ($values as $index => &$value) {
                    $id = is_array($value) ? (string) ($value['slug'] ?? $value['id'] ?? 'index-'.$index) : 'index-'.$index;
                    $edited = $lookup[$group][$id] ?? null;

                    if (is_array($edited)) {
                        if (is_array($value)) {
                            $value = self::mergeEditable($value, $edited);
                        } elseif (array_key_exists('value', $edited) && is_string($value)) {
                            $value = (string) $edited['value'];
                        }
                    }
                }
                unset($value);
            } else {
                foreach ($values as $key => &$value) {
                    $edited = $lookup[$group][$key] ?? null;
                    if (is_array($value) && is_array($edited)) {
                        $value = self::mergeEditable($value, $edited);
                    }
                }
                unset($value);
            }
        }
        unset($values);

        return $source;
    }

    private static function mergeEditable(array $baseline, array $edited): array
    {
        $protected = ['slug', 'id', 'group', 'category', 'axis', 'reverse', 'version', 'related', 'slugs'];

        foreach ($baseline as $key => &$value) {
            if (in_array((string) $key, $protected, true) || ! array_key_exists($key, $edited)) {
                continue;
            }
            $replacement = $edited[$key];

            if (is_string($value) && is_string($replacement)) {
                $value = $replacement;
            } elseif (is_int($value) && is_numeric($replacement)) {
                $value = (int) $replacement;
            } elseif (is_array($value) && is_array($replacement)) {
                // Never add/remove questions, options, answers or other positions.
                $value = self::mergeEditable($value, $replacement);
            }
        }
        unset($value);

        return $baseline;
    }
}
