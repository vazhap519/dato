<?php

namespace App\Filament\Resources\LegalDocuments\Pages;

use App\Filament\Resources\LegalDocuments\LegalDocumentResource;
use Filament\Resources\Pages\EditRecord;

class EditLegalDocument extends EditRecord
{
    protected static string $resource = LegalDocumentResource::class;

    protected function beforeSave(): void
    {
        if (! $this->record->is_published) return;

        $this->record->versions()->create([
            'title' => $this->record->title,
            'content' => $this->record->content,
            'version' => $this->record->version,
            'effective_at' => $this->record->effective_at,
            'archived_at' => now(),
        ]);
    }
}
