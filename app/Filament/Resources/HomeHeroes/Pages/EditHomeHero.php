<?php

namespace App\Filament\Resources\HomeHeroes\Pages;

use App\Filament\Resources\HomeHeroes\HomeHeroResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditHomeHero extends EditRecord
{
    protected static string $resource = HomeHeroResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
