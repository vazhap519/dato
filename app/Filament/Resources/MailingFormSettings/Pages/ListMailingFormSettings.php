<?php

namespace App\Filament\Resources\MailingFormSettings\Pages;

use App\Filament\Resources\MailingFormSettings\MailingFormSettingResource;
use App\Models\MailingFormSetting;
use Filament\Resources\Pages\ListRecords;
use Filament\Actions\Action;

class ListMailingFormSettings extends ListRecords
{
    protected static string $resource = MailingFormSettingResource::class;
    protected function getHeaderActions(): array {
        return [
            Action::make('configure')->label('Открыть настройки')
                ->url(fn () => MailingFormSettingResource::getUrl('edit', ['record' => MailingFormSetting::firstOrCreate(['id'=>1])->id])),
        ];
    }
}
