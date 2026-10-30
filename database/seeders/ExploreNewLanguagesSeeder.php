<?php

namespace Database\Seeders;

use App\Models\SelfDiscoveryTool;
use Illuminate\Database\Seeder;

class ExploreNewLanguagesSeeder extends Seeder
{
    public function run(): void
    {
        $languages = [
            ['relationships', 'Язык отношений', 'Замечай себя рядом с другими', 'Как ты реагируешь на критику, отказ, близость и границы? Исследуй привычные реакции и способы честного диалога.', 'diversity_3'],
            ['body', 'Язык тела', 'Слушай ощущения без диагнозов', 'Обрати внимание на дыхание, напряжение и усталость. Замечай сигналы тела и выбирай бережные шаги.', 'self_improvement'],
            ['choice', 'Язык выбора', 'Увидь свои решения', 'Исследуй жизненные развилки, влияние страха, привычек и чужих ожиданий. Учись замечать свои критерии выбора.', 'alt_route'],
            ['beliefs', 'Язык убеждений', 'Проверяй внутренние правила', 'Разберись, как привычные мысли влияют на решения. Отделяй наблюдение от предположения и ищи более точные формулировки.', 'psychology_alt'],
            ['values', 'Язык ценностей', 'От слов — к поступкам', 'Замечай, что действительно важно для тебя, и как свобода, близость, развитие и забота проявляются в ежедневных решениях.', 'explore'],
        ];

        foreach ($languages as $index => [$slug, $title, $subtitle, $description, $icon]) {
            SelfDiscoveryTool::query()->firstOrCreate(
                ['slug' => $slug],
                [
                    'title' => $title,
                    'subtitle' => $subtitle,
                    'description' => $description,
                    'icon' => $icon,
                    'url' => '/explore/'.$slug,
                    'sort' => 70 + $index * 10,
                    'is_published' => true,
                ],
            );
        }

        $this->command?->info('Добавлено пять направлений (существующие настройки не перезаписаны).');
    }
}
