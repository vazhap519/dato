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
use Filament\Schemas\Components\Section;
use Filament\Tables\Columns\ToggleColumn;
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
            Section::make('Поток и содержание')->schema([
                Select::make('live_series_id')->label('Поток практикума')->relationship('series','title')->searchable()->preload()->createOptionForm([
                    TextInput::make('title')->label('Название потока')->required(),
                ])->required(),
                TextInput::make('day_number')->label('Номер дня')->numeric()->minValue(1)->maxValue(30)->required(),
                TextInput::make('title')->label('Название эфира')->required()->maxLength(255),
                Textarea::make('description')->label('Описание под видеоплеером')->rows(3),
                TextInput::make('youtube_url')->label('Ссылка на YouTube Live')->url()->placeholder('https://www.youtube.com/live/...'),
            ])->columns(2),
            Section::make('Публикация и порядок')->description('Новый эфир скрыт от посетителей, пока вы не включите публикацию. Создание потока не публикует эфир автоматически.')->schema([
                Toggle::make('is_published')->label('Показывать эфир на /live')->default(false)->helperText('Скрытый эфир остаётся в админ-панели, но не появляется у зрителей.'),
                TextInput::make('sort_order')->label('Порядок показа')->numeric()->minValue(0)->default(0)->helperText('Меньшее число — выше в списке.'),
                TextInput::make('tab_label')->label('Название кнопки выбора эфира')->maxLength(120)->placeholder('Например: День 1 · Внимание')->helperText('Если не заполнено — День N · Название эфира.'),
                Select::make('status')->label('Статус')->options([
                    'scheduled'=>'Запланирован','live'=>'В эфире','ended'=>'Завершён',
                ])->required()->default('scheduled')->helperText('При переводе в «Завершён» сообщения этого эфира удаляются.'),
            ])->columns(2),
            Section::make('Видеоплеер и чат')->schema([
                Toggle::make('show_video')->label('Показывать видеоплеер')->default(true),
                TextInput::make('video_placeholder')->label('Текст, когда видео не добавлено')->maxLength(255)->placeholder('Видео появится здесь перед началом эфира'),
                Toggle::make('show_chat')->label('Показывать блок чата')->default(true),
                Toggle::make('chat_enabled')->label('Разрешить отправку сообщений')->default(true)->helperText('Работает только для эфиров со статусом «В эфире».'),
                TextInput::make('chat_title')->label('Заголовок чата')->maxLength(120)->placeholder('Чат участников'),
                TextInput::make('chat_empty_text')->label('Текст пустого чата')->maxLength(255)->placeholder('Пока нет сообщений. Начни разговор!'),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table {
        return $table->columns([
            TextColumn::make('series.title')->label('Поток'),
            TextColumn::make('day_number')->label('День')->sortable(),
            TextColumn::make('title')->label('Эфир')->searchable(),
            TextColumn::make('status')->label('Статус')->badge(),
            ToggleColumn::make('is_published')->label('Показывать на сайте'),
            TextColumn::make('sort_order')->label('Порядок')->sortable(),
            TextColumn::make('created_at')->label('Создан')->dateTime('d.m.Y'),
        ])->recordActions([\Filament\Actions\EditAction::make()]);
    }

    public static function getPages(): array {
        return ['index'=>ListLiveSessions::route('/'), 'create'=>CreateLiveSession::route('/create'), 'edit'=>EditLiveSession::route('/{record}/edit')];
    }
}