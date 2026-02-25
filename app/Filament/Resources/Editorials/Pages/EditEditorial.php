<?php

namespace App\Filament\Resources\Editorials\Pages;

use App\Filament\Resources\Editorials\EditorialResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditEditorial extends EditRecord
{
    protected static string $resource = EditorialResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
