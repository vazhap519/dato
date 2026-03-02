<?php

namespace App\Filament\Resources\ClosedGroups\Pages;

use App\Filament\Resources\ClosedGroups\ClosedGroupResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListClosedGroups extends ListRecords
{
    protected static string $resource = ClosedGroupResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
