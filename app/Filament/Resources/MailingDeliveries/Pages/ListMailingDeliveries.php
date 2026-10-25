<?php

namespace App\Filament\Resources\MailingDeliveries\Pages;

use App\Filament\Resources\MailingDeliveries\MailingDeliveryResource;
use Filament\Resources\Pages\ListRecords;

class ListMailingDeliveries extends ListRecords
{
    protected static string $resource = MailingDeliveryResource::class;
}
