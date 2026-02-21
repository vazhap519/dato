<?php

namespace App\Filament\Resources\Practises\Pages;

use App\Filament\Resources\Practises\PractiseResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPractise extends EditRecord
{
    protected static string $resource = PractiseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
