<?php

namespace App\Filament\Resources\HomeHeroes\Pages;

use App\Filament\Resources\HomeHeroes\HomeHeroResource;
use Filament\Resources\Pages\CreateRecord;

class CreateHomeHero extends CreateRecord
{
    protected static string $resource = HomeHeroResource::class;
}
