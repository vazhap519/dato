<?php

namespace App\Filament\Resources\LiveModerators\Pages;

use App\Filament\Resources\LiveModerators\LiveModeratorResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListLiveModerators extends ListRecords {
    protected static string $resource = LiveModeratorResource::class;
    protected function getHeaderActions(): array { return [CreateAction::make()]; }
}
