<?php

namespace App\Filament\Resources\LiveModerators\Pages;

use App\Filament\Resources\LiveModerators\LiveModeratorResource;
use App\Models\LiveModerator;
use Filament\Resources\Pages\CreateRecord;

class CreateLiveModerator extends CreateRecord {
    protected static string $resource = LiveModeratorResource::class;
    protected function mutateFormDataBeforeCreate(array $data): array {
        $token = LiveModerator::newToken();
        $data['access_token_hash'] = hash('sha256', $token);
        session()->flash('live_moderator_link', url('/moderator/'.$token));
        return $data;
    }
    protected function getCreatedNotificationTitle(): ?string { return 'Модератор создан. Скопируйте ссылку со страницы — повторно она не показывается.'; }
}
