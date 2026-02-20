<?php

namespace App\Filament\Resources\NotFounds\Pages;

use App\Filament\Resources\NotFounds\NotFoundResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListNotFounds extends ListRecords
{
    protected static string $resource = NotFoundResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
