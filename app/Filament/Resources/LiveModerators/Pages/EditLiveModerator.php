<?php

namespace App\Filament\Resources\LiveModerators\Pages;

use App\Filament\Resources\LiveModerators\LiveModeratorResource;
use App\Models\LiveModerator;
use Filament\Actions\Action;
use Filament\Resources\Pages\EditRecord;
use Filament\Notifications\Notification;

class EditLiveModerator extends EditRecord {
    protected static string $resource = LiveModeratorResource::class;
    protected function getHeaderActions(): array {
        return [Action::make('rotateLink')->label('Создать новую ссылку')->requiresConfirmation()->action(function () {
            $token = LiveModerator::newToken();
            $this->record->update(['access_token_hash' => hash('sha256', $token), 'access_token_encrypted' => $token]);
            Notification::make()->title('Новая ссылка (скопируйте сейчас)')->body(url('/moderator/'.$token))->persistent()->success()->send();
        })];
    }
}
