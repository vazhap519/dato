<?php
namespace App\Filament\Resources\NumberMeanings\Pages;
use App\Filament\Resources\NumberMeanings\NumberMeaningResource;
use Filament\Resources\Pages\ListRecords;
use Filament\Actions\CreateAction;
class ListNumberMeanings extends ListRecords {
    protected static string $resource = NumberMeaningResource::class;
    protected function getHeaderActions(): array { return [CreateAction::make()]; }
}
