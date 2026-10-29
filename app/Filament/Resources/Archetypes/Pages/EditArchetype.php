<?php

namespace App\Filament\Resources\Archetypes\Pages;

use App\Filament\Resources\Archetypes\ArchetypeResource;
use Filament\Resources\Pages\EditRecord;

class EditArchetype extends EditRecord
{
    protected static string $resource = ArchetypeResource::class;
}
