<?php

namespace App\Filament\Resources\HomeHeroes\Pages;

use App\Filament\Resources\HomeHeroes\HomeHeroResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListHomeHeroes extends ListRecords
{
    protected static string $resource = HomeHeroResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
