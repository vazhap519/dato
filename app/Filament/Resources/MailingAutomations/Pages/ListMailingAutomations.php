<?php

namespace App\Filament\Resources\MailingAutomations\Pages;

use App\Filament\Resources\MailingAutomations\MailingAutomationResource;
use Filament\Resources\Pages\ListRecords;
use Filament\Actions\CreateAction;

class ListMailingAutomations extends ListRecords
{
    protected static string $resource = MailingAutomationResource::class;
    protected function getHeaderActions(): array { return [CreateAction::make()->label('Создать письмо')]; }
}
