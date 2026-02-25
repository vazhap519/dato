<?php

namespace App\Filament\Resources\Editorials\Pages;

use App\Filament\Resources\Editorials\EditorialResource;
use Filament\Resources\Pages\CreateRecord;

class CreateEditorial extends CreateRecord
{
    protected static string $resource = EditorialResource::class;
}
