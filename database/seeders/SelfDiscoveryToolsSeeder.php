<?php

namespace Database\Seeders;

use App\Models\SelfDiscoveryTool;
use Illuminate\Database\Seeder;

class SelfDiscoveryToolsSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['numbers','Язык чисел','Замечай совпадения','Символические толкования чисел и вопросы для самонаблюдения.','tag',10,true],
            ['emotions','Язык эмоций','Услышь свои чувства','Выбери эмоцию, исследуй её и попробуй короткую практику внимания.','favorite',20,true],
            ['dreams','Язык снов','Исследуй образы','Образы сновидений как повод вспомнить чувства и личные ассоциации.','bedtime',30,false],
            ['archetypes','Язык архетипов','Узнай свои роли','Исследуй привычные роли и реакции без ярлыков и диагнозов.','theater_comedy',40,true],
            ['patterns','Язык повторений','Замечай сценарии','Взгляни на повторяющиеся ситуации и собственные решения.','repeat',50,false],
            ['mirror','Зеркало личности','Встречайся с собой','Вопросы для исследования привычек, потребностей и внутренних противоречий.','psychology',60,false],
        ];
        foreach ($items as [$slug,$title,$subtitle,$description,$icon,$sort,$published]) {
            SelfDiscoveryTool::firstOrCreate(['slug' => $slug], [
                'title'=>$title,'subtitle'=>$subtitle,'description'=>$description,'icon'=>$icon,
                'url'=>match ($slug) { 'numbers'=>'/numbers', 'emotions'=>'/explore/emotions', 'archetypes'=>'/explore/archetypes', default=>null },
                'sort'=>$sort,'is_published'=>$published,
            ]);
        }
    }
}
