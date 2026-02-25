<?php

namespace App\Filament\Resources\Editorials\Pages;

use App\Filament\Resources\Editorials\EditorialResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListEditorials extends ListRecords
{
    protected static string $resource = EditorialResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
