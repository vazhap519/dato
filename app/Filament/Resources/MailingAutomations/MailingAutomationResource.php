<?php

namespace App\Filament\Resources\MailingAutomations;

use App\Filament\Resources\MailingAutomations\Pages\ListMailingAutomations;
use App\Filament\Resources\MailingAutomations\Pages\CreateMailingAutomation;
use App\Filament\Resources\MailingAutomations\Pages\EditMailingAutomation;
use App\Models\MailingAutomation;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;

class MailingAutomationResource extends Resource
{
    protected static ?string $model = MailingAutomation::class;
    protected static ?string $navigationLabel = 'Автописьма';
    protected static ?string $pluralModelLabel = 'Автописьма';
    protected static ?string $modelLabel = 'Автописьмо';
    protected static \UnitEnum|string|null $navigationGroup = 'Рассылка';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedEnvelopeOpen;
    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema {
        return $schema->components([
            TextInput::make('name')->label('Название для админ-панели')->required()->maxLength(150),
            TextInput::make('event_key')->label('Код события')->helperText('Для будущей автоматизации. Например: email_verification, welcome, practice_day_1.')->maxLength(100),
            TextInput::make('subject')->label('Тема письма')->required()->maxLength(255),
            Textarea::make('body')->label('Текст письма')->required()->rows(12)
                ->helperText('Можно использовать {name}. Для подтверждения email предусмотрен {confirmation_link}; ссылка начнёт работать после подключения отправки и проверки.'),
            Toggle::make('is_enabled')->label('Разрешить автоматическую отправку')->default(false)
                ->helperText('Пока отправка этих писем не подключена. Переключатель сохраняет настройку на будущее.'),
        ]);
    }

    public static function table(Table $table): Table {
        return $table->columns([
            TextColumn::make('name')->label('Название')->searchable(),
            TextColumn::make('event_key')->label('Событие'),
            TextColumn::make('subject')->label('Тема письма')->searchable()->limit(60),
            IconColumn::make('is_enabled')->label('Разрешено')->boolean(),
            TextColumn::make('updated_at')->label('Изменено')->dateTime('d.m.Y H:i')->sortable(),
        ])->recordActions([EditAction::make()->label('Редактировать')])
          ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array {
        return [
            'index' => ListMailingAutomations::route('/'),
            'create' => CreateMailingAutomation::route('/create'),
            'edit' => EditMailingAutomation::route('/{record}/edit'),
        ];
    }
}
