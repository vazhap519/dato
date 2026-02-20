<?php

namespace App\Filament\Resources\HomeAboutSections\Pages;

use App\Filament\Resources\HomeAboutSections\HomeAboutSectionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListHomeAboutSections extends ListRecords
{
    protected static string $resource = HomeAboutSectionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
