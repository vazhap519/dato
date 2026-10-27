<?php
namespace App\Filament\Resources\NumberMeanings\Pages;
use App\Filament\Resources\NumberMeanings\NumberMeaningResource;
use Filament\Resources\Pages\EditRecord;
use Filament\Actions\DeleteAction;
class EditNumberMeaning extends EditRecord {
    protected static string $resource = NumberMeaningResource::class;
    protected function getHeaderActions(): array { return [DeleteAction::make()]; }
}
