<?php

namespace App\Filament\Resources\MailingContacts\Pages;

use App\Filament\Resources\MailingContacts\MailingContactResource;
use Filament\Resources\Pages\ListRecords;

class ListMailingContacts extends ListRecords
{
    protected static string $resource = MailingContactResource::class;
}
