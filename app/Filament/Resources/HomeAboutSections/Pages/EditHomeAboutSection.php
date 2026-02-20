<?php

namespace App\Filament\Resources\HomeAboutSections\Pages;

use App\Filament\Resources\HomeAboutSections\HomeAboutSectionResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditHomeAboutSection extends EditRecord
{
    protected static string $resource = HomeAboutSectionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
