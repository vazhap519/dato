<?php

namespace App\Filament\Resources\Practises\Pages;

use App\Filament\Resources\Practises\PractiseResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPractises extends ListRecords
{
    protected static string $resource = PractiseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
