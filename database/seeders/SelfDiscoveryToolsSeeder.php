<?php

namespace Database\Seeders;

use App\Models\SelfDiscoveryTool;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SelfDiscoveryToolsSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['numbers', 'Язык чисел', 'Замечай совпадения', 'Символические толкования чисел и вопросы для самонаблюдения.', 'tag', 10, true],
            ['emotions', 'Язык эмоций', 'Услышь свои чувства', 'Выбери эмоцию, исследуй её и попробуй короткую практику внимания.', 'favorite', 20, true],
            ['dreams', 'Язык снов', 'Исследуй образы', 'Образы сновидений как повод вспомнить чувства и личные ассоциации.', 'bedtime', 30, true],
            ['archetypes', 'Язык архетипов', 'Узнай свои роли', 'Исследуй привычные роли и реакции без ярлыков и диагнозов.', 'theater_comedy', 40, true],
            ['patterns', 'Язык повторений', 'Замечай сценарии', 'Взгляни на повторяющиеся ситуации и собственные решения.', 'repeat', 50, true],
            ['mirror', 'Зеркало личности', 'Встречайся с собой', 'Вопросы для исследования привычек, потребностей и внутренних противоречий.', 'psychology', 60, true],
        ];

        DB::transaction(function () use ($items): void {
            foreach ($items as [$slug, $title, $subtitle, $description, $icon, $sort, $published]) {
                $url = match ($slug) {
                    'numbers' => '/numbers',
                    'emotions' => '/explore/emotions',
                    'dreams' => '/explore/dreams',
                    'archetypes' => '/explore/archetypes',
                    'patterns' => '/explore/patterns',
                    'mirror' => '/explore/mirror',
                };

                $attributes = [
                    'title' => $title,
                    'subtitle' => $subtitle,
                    'description' => $description,
                    'icon' => $icon,
                    'url' => $url,
                    'sort' => $sort,
                    'is_published' => $published,
                ];

                if (in_array($slug, ['dreams', 'patterns', 'mirror'], true)) {
                    // Existing hidden catalog entries must become visible after successful installation.
                    SelfDiscoveryTool::updateOrCreate(
                        ['slug' => $slug],
                        array_merge($attributes, ['is_published' => true]),
                    );
                } elseif ($slug === 'archetypes') {
                    // Keep the existing working archetype route active.
                    $tool = SelfDiscoveryTool::firstOrCreate(['slug' => $slug], $attributes);
                    $tool->update(['url' => $url, 'is_published' => true]);
                } else {
                    // Do not overwrite existing settings for the previously published directions.
                    SelfDiscoveryTool::firstOrCreate(['slug' => $slug], $attributes);
                }
            }
        });
    }
}
