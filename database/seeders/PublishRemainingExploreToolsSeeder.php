<?php

namespace Database\Seeders;

use App\Models\SelfDiscoveryTool;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Publish only the three newly implemented self-discovery directions.
 *
 * Existing admin-defined names, subtitles, ordering, icons and descriptions
 * are preserved; only their destination URL and visibility are updated.
 */
class PublishRemainingExploreToolsSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'slug' => 'dreams',
                'title' => 'Язык снов',
                'subtitle' => 'Исследуй образы',
                'description' => 'Образы сновидений как повод вспомнить чувства и личные ассоциации.',
                'icon' => 'bedtime',
                'sort' => 30,
                'url' => '/explore/dreams',
            ],
            [
                'slug' => 'patterns',
                'title' => 'Язык повторений',
                'subtitle' => 'Замечай сценарии',
                'description' => 'Взгляни на повторяющиеся ситуации и собственные решения.',
                'icon' => 'repeat',
                'sort' => 50,
                'url' => '/explore/patterns',
            ],
            [
                'slug' => 'mirror',
                'title' => 'Зеркало личности',
                'subtitle' => 'Встречайся с собой',
                'description' => 'Вопросы для исследования привычек, потребностей и внутренних противоречий.',
                'icon' => 'psychology',
                'sort' => 60,
                'url' => '/explore/mirror',
            ],
        ];

        DB::transaction(function () use ($items): void {
            foreach ($items as $item) {
                $tool = SelfDiscoveryTool::firstOrCreate(
                    ['slug' => $item['slug']],
                    $item + ['is_published' => true],
                );

                $tool->update([
                    'url' => $item['url'],
                    'is_published' => true,
                ]);
            }
        });
    }
}
