<?php

namespace App\Filament\Resources\Legals\Pages;

use App\Filament\Resources\Legals\LegalResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditLegal extends EditRecord
{
    protected static string $resource = LegalResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
