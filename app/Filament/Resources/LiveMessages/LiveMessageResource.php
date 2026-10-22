<?php

namespace App\Filament\Resources\LiveMessages;

use App\Filament\Resources\LiveMessages\Pages\ListLiveMessages;
use App\Models\LiveMessage;
use App\Models\LiveIpBan;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Forms\Components\DatePicker;
use Illuminate\Database\Eloquent\Builder;
use Filament\Tables\Table;
use Filament\Actions\Action;

class LiveMessageResource extends Resource {
    protected static ?string $model = LiveMessage::class;
    protected static ?string $modelLabel = 'сообщение эфира';
    protected static ?string $pluralModelLabel = 'история чата';
    protected static ?string $navigationLabel = 'История чата';
    protected static \UnitEnum|string|null $navigationGroup = 'Прямые эфиры';
    protected static ?int $navigationSort = 3;
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChatBubbleLeftRight;
    public static function form(Schema $schema): Schema { return $schema; }
    public static function table(Table $table): Table {
        return $table->columns([
            TextColumn::make('session.title')->label('Эфир'),
            TextColumn::make('author_name')->label('Автор')->searchable(),
            TextColumn::make('body')->label('Сообщение')->searchable()->wrap()->limit(160),
            IconColumn::make('is_hidden')->label('Скрыто')->boolean(),
            TextColumn::make('created_at')->label('Время')->dateTime('d.m.Y H:i')->sortable(),
        ])->filters([
            SelectFilter::make('live_session_id')->label('Эфир')->relationship('session','title'),
        ])->defaultSort('created_at', 'desc')->recordActions([
            Action::make('toggleHidden')->label(fn (LiveMessage $record) => $record->is_hidden ? 'Показать' : 'Скрыть')
                ->action(fn (LiveMessage $record) => $record->update(['is_hidden' => ! $record->is_hidden])),
            Action::make('banIp')->label('Заблокировать IP')->color('danger')
                ->visible(fn (LiveMessage $record) => filled($record->ip_hash))
                ->requiresConfirmation()
                ->action(fn (LiveMessage $record) => LiveIpBan::updateOrCreate(
                    ['ip_hash' => $record->ip_hash],
                    ['expires_at' => now()->addDay(), 'reason' => 'Модерация чата']
                )),
            Action::make('banGuest')->label('Заблокировать гостя')->color('danger')
                ->visible(fn (LiveMessage $record) => $record->live_guest_id !== null)
                ->requiresConfirmation()
                ->action(fn (LiveMessage $record) => $record->guest?->update(['is_banned' => true])),
        ]);
    }
    public static function getPages(): array { return ['index'=>ListLiveMessages::route('/')]; }
}