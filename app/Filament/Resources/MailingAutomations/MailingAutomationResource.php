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
use Filament\Forms\Components\Select;
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
            TextInput::make('event_key')->label('Код события')->helperText('Для подтверждения email оставь email_verification. Для остальных писем — уникальный код.')->maxLength(100),
            Select::make('trigger_event')->label('Когда отправлять')->options([
                'manual' => 'Вручную (автоматическая отправка выключена)',
                'email_verified' => 'После подтверждения email',
            ])->default('manual')->required(),
            TextInput::make('delay_minutes')->label('Задержка после события (минут)')->numeric()->minValue(0)->maxValue(525600)->default(0)->required(),
            Select::make('audience')->label('Тип согласия')->options([
                'marketing' => 'Новости и рассылки (требуется согласие)',
                'reminders' => 'Напоминания о практикуме',
            ])->default('marketing')->required(),
            TextInput::make('subject')->label('Тема письма')->required()->maxLength(255),
            Textarea::make('body')->label('Текст письма')->required()->rows(12)
                ->helperText('Можно использовать {name}. Для подтверждения email предусмотрен {confirmation_link}; ссылка используется только в письме подтверждения email. Для других писем: {name}, {email}, {unsubscribe_link}.'),
            Toggle::make('is_enabled')->label('Разрешить автоматическую отправку')->default(false)
                ->helperText('Для события «После подтверждения email» включает реальную отправку. Для «Вручную» отправка не запускается.'),
        ]);
    }

    public static function table(Table $table): Table {
        return $table->columns([
            TextColumn::make('name')->label('Название')->searchable(),
            TextColumn::make('event_key')->label('Код'),
            TextColumn::make('trigger_event')->label('Запуск')->formatStateUsing(fn ($state) => $state === 'email_verified' ? 'Подтверждение email' : 'Вручную'),
            TextColumn::make('delay_minutes')->label('Задержка, мин.'),
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
