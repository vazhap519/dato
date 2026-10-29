<?php

namespace App\Filament\Resources\SelfDiscoveryTools\Pages;

use App\Filament\Resources\SelfDiscoveryTools\SelfDiscoveryToolResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSelfDiscoveryTools extends ListRecords
{
    protected static string $resource = SelfDiscoveryToolResource::class;
    protected function getHeaderActions(): array { return [CreateAction::make()]; }
}
