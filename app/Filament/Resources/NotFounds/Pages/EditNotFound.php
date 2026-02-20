<?php

namespace App\Filament\Resources\NotFounds\Pages;

use App\Filament\Resources\NotFounds\NotFoundResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditNotFound extends EditRecord
{
    protected static string $resource = NotFoundResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
