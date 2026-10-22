<?php

namespace App\Filament\Resources\LiveMessages;

use App\Filament\Resources\LiveMessages\Pages\ListLiveMessages;
use App\Models\LiveMessage;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Filament\Actions\Action;

class LiveMessageResource extends Resource {
    protected static ?string $model = LiveMessage::class;
    protected static ?string $modelLabel = 'сообщение эфира';
    protected static ?string $pluralModelLabel = 'история чата';
    protected static ?string $navigationLabel = 'История чата';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChatBubbleLeftRight;
    public static function form(Schema $schema): Schema { return $schema; }
    public static function table(Table $table): Table {
        return $table->columns([
            TextColumn::make('session.title')->label('Эфир'),
            TextColumn::make('author_name')->label('Участник')->searchable(),
            TextColumn::make('body')->label('Сообщение')->searchable()->wrap()->limit(160),
            TextColumn::make('is_hidden')->label('Скрыто')->boolean(),
            TextColumn::make('created_at')->label('Время')->dateTime('d.m.Y H:i')->sortable(),
        ])->filters([
            SelectFilter::make('live_session_id')->label('Эфир')->relationship('session','title'),
        ])->recordActions([
            Action::make('toggleHidden')->label(fn (LiveMessage $record) => $record->is_hidden ? 'Показать' : 'Скрыть')
                ->action(fn (LiveMessage $record) => $record->update(['is_hidden' => ! $record->is_hidden])),
            Action::make('banGuest')->label('Заблокировать гостя')->color('danger')
                ->visible(fn (LiveMessage $record) => $record->live_guest_id !== null)
                ->requiresConfirmation()
                ->action(fn (LiveMessage $record) => $record->guest?->update(['is_banned' => true])),
        ]);
    }
    public static function getPages(): array { return ['index'=>ListLiveMessages::route('/')]; }
}