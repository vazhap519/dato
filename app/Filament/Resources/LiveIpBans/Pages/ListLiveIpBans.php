<?php
namespace App\Filament\Resources\LiveIpBans\Pages;
use App\Filament\Resources\LiveIpBans\LiveIpBanResource;
use Filament\Resources\Pages\ListRecords;
class ListLiveIpBans extends ListRecords {
    protected static string $resource = LiveIpBanResource::class;
}
