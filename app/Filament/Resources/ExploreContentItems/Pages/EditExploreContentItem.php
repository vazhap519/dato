<?php

namespace App\Filament\Resources\ExploreContentItems\Pages;

use App\Filament\Resources\ExploreContentItems\ExploreContentItemResource;
use Filament\Resources\Pages\EditRecord;

class EditExploreContentItem extends EditRecord
{
    protected static string $resource = ExploreContentItemResource::class;

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Technical IDs, answer ordering and unrendered nested fields are not
        // sent by the form. Merge submitted content into the existing source
        // rather than replacing the complete JSON object.
        $data['payload'] = array_replace_recursive(
            $this->record->payload ?? [],
            $data['payload'] ?? [],
        );

        return $data;
    }
}
