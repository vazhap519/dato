<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Run explicitly: php artisan db:seed --class=AllEditorialNumberMeaningsSeeder --force
 * Does not invoke DatabaseSeeder (which creates a test user).
 */
class AllEditorialNumberMeaningsSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            NumberMeaningSeeder::class,
            AllNumbersSeeder::class,
            RefineNumberMeaningsSeeder::class,
            EditorialNumberMeaningsSeeder::class,
            EditorialNumberMeanings40to69Seeder::class,
            EditorialNumberMeanings70to99Seeder::class,
            EditorialNumberMeanings100to129Seeder::class,
            EditorialNumberMeaningsGapFixSeeder::class,
            EditorialNumberMeanings130to159Seeder::class,
            EditorialNumberMeanings160to199Seeder::class,
            EditorialNumberMeanings200to239Seeder::class,
            EditorialNumberMeanings240to279Seeder::class,
            EditorialNumberMeanings280to319Seeder::class,
            EditorialNumberMeanings320to359Seeder::class,
            EditorialNumberMeanings360to399Seeder::class,
            EditorialNumberMeanings400to439Seeder::class,
            EditorialNumberMeanings440to459Seeder::class,
            EditorialNumberMeanings460to499Seeder::class,
            EditorialNumberMeanings500to539Seeder::class,
            EditorialNumberMeanings540to579Seeder::class,
            EditorialNumberMeanings580to619Seeder::class,
            EditorialNumberMeanings620to659Seeder::class,
            EditorialNumberMeanings660to699Seeder::class,
            EditorialNumberMeanings700to739Seeder::class,
            EditorialNumberMeanings740to779Seeder::class,
            EditorialNumberMeanings780to819Seeder::class,
            EditorialNumberMeanings820to859Seeder::class,
            EditorialNumberMeanings860to899Seeder::class,
            EditorialNumberMeanings900to939Seeder::class,
            EditorialNumberMeanings940to979Seeder::class,
            EditorialNumberMeanings980to999Seeder::class,
        ]);
    }
}
