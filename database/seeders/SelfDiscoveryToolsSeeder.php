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
            ['numbers','Язык чисел','Замечай совпадения','Символические толкования чисел и вопросы для самонаблюдения.','tag',10,true],
            ['emotions','Язык эмоций','Услышь свои чувства','Выбери эмоцию, исследуй её и попробуй короткую практику внимания.','favorite',20,true],
            ['dreams','Язык снов','Исследуй образы','Образы сновидений как повод вспомнить чувства и личные ассоциации.','bedtime',30,true],
            ['archetypes','Язык архетипов','Узнай свои роли','Исследуй привычные роли и реакции без ярлыков и диагнозов.','theater_comedy',40,true],
            ['patterns','Язык повторений','Замечай сценарии','Взгляни на повторяющиеся ситуации и собственные решения.','repeat',50,true],
            ['mirror','Зеркало личности','Встречайся с собой','Вопросы для исследования привычек, потребностей и внутренних противоречий.','psychology',60,true],
        ];
        DB::transaction(function () use ($items): void {
            foreach ($items as [$slug,$title,$subtitle,$description,$icon,$sort,$published]) {
                $attributes = [
                'title'=>$title,'subtitle'=>$subtitle,'description'=>$description,'icon'=>$icon,
                'url'=>match ($slug) { 'numbers'=>'/numbers', 'emotions'=>'/explore/emotions', 'archetypes'=>'/explore/archetypes', 'dreams'=>'/explore/dreams', 'patterns'=>'/explore/patterns', 'mirror'=>'/explore/mirror', default=>null },
                'sort'=>$sort,'is_published'=>$published,
            ];
            if (in_array($slug, ['archetypes', 'dreams', 'patterns', 'mirror'], true)) {
                // Activate implemented pages even when catalog entries already exist.
                $tool = SelfDiscoveryTool::firstOrCreate(['slug' => $slug], $attributes);
                $tool->update(['url' => $attributes['url'], 'is_published' => true]);
            } else {
                SelfDiscoveryTool::firstOrCreate(['slug' => $slug], $attributes);
            }
            }
        });
    }
}
