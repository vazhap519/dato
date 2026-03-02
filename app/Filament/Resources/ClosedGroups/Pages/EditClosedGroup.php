<?php

namespace App\Filament\Resources\ClosedGroups\Pages;

use App\Filament\Resources\ClosedGroups\ClosedGroupResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditClosedGroup extends EditRecord
{
    protected static string $resource = ClosedGroupResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
