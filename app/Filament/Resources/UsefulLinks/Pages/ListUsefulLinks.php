<?php

namespace App\Filament\Resources\UsefulLinks\Pages;

use App\Filament\Resources\UsefulLinks\UsefulLinkResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListUsefulLinks extends ListRecords
{
    protected static string $resource = UsefulLinkResource::class;

    protected function getHeaderActions(): array
    {
        return [CreateAction::make()];
    }
}
