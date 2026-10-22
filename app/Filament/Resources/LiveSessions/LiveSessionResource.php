<?php

namespace App\Filament\Resources\LiveSessions;

use App\Filament\Resources\LiveSessions\Pages\CreateLiveSession;
use App\Filament\Resources\LiveSessions\Pages\EditLiveSession;
use App\Filament\Resources\LiveSessions\Pages\ListLiveSessions;
use App\Models\LiveSession;
use BackedEnum;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class LiveSessionResource extends Resource {
    protected static ?string $model = LiveSession::class;
    protected static ?string $modelLabel = 'эфир';
    protected static ?string $pluralModelLabel = 'прямые эфиры';
    protected static ?string $navigationLabel = 'Прямые эфиры';
    protected static \UnitEnum|string|null $navigationGroup = 'Прямые эфиры';
    protected static ?int $navigationSort = 1;
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedVideoCamera;

    public static function form(Schema $schema): Schema {
        return $schema->components([
            Select::make('live_series_id')->label('Поток практикума')->relationship('series','title')->searchable()->preload()->createOptionForm([
                TextInput::make('title')->label('Название потока')->required(),
            ])->required(),
            TextInput::make('day_number')->label('Номер дня')->numeric()->minValue(1)->maxValue(30)->required(),
            TextInput::make('title')->label('Название эфира')->required()->maxLength(255),
            Textarea::make('description')->label('Описание'),
            TextInput::make('youtube_url')->label('Ссылка на YouTube Live')->url()->placeholder('https://www.youtube.com/live/...'),
            Select::make('status')->label('Статус')->options([
                'scheduled'=>'Запланирован','live'=>'В эфире','ended'=>'Завершён',
            ])->required()->default('scheduled'),
            Toggle::make('chat_enabled')->label('Разрешить сообщения')->default(true),
        ]);
    }

    public static function table(Table $table): Table {
        return $table->columns([
            TextColumn::make('series.title')->label('Поток'),
            TextColumn::make('day_number')->label('День')->sortable(),
            TextColumn::make('title')->label('Эфир')->searchable(),
            TextColumn::make('status')->label('Статус')->badge(),
            TextColumn::make('created_at')->label('Создан')->dateTime('d.m.Y'),
        ])->recordActions([\Filament\Actions\EditAction::make()]);
    }

    public static function getPages(): array {
        return ['index'=>ListLiveSessions::route('/'), 'create'=>CreateLiveSession::route('/create'), 'edit'=>EditLiveSession::route('/{record}/edit')];
    }
}