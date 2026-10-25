<?php

namespace App\Filament\Resources\MailingFormSettings;

use App\Filament\Resources\MailingFormSettings\Pages\ListMailingFormSettings;
use App\Filament\Resources\MailingFormSettings\Pages\EditMailingFormSetting;
use App\Models\MailingFormSetting;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\EditAction;

class MailingFormSettingResource extends Resource
{
    protected static ?string $model = MailingFormSetting::class;
    protected static ?string $navigationLabel = 'Настройки формы';
    protected static ?string $pluralModelLabel = 'Настройки формы';
    protected static ?string $modelLabel = 'Настройки формы';
    protected static \UnitEnum|string|null $navigationGroup = 'Рассылка';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;
    protected static ?int $navigationSort = 3;
    public static function form(Schema $schema): Schema {
        return $schema->components([
            TextInput::make('title')->label('Заголовок')->required()->maxLength(255),
            Textarea::make('description')->label('Описание')->required(),
            TextInput::make('name_label')->label('Подпись поля имени')->required(),
            TextInput::make('email_label')->label('Подпись поля email')->required(),
            TextInput::make('phone_label')->label('Подпись поля телефона')->required(),
            TextInput::make('reminders_label')->label('Текст согласия на напоминания')->required(),
            TextInput::make('marketing_label')->label('Текст необязательной подписки')->required(),
            TextInput::make('button_text')->label('Текст кнопки')->required(),
            TextInput::make('success_text')->label('Сообщение об успешной регистрации')->required(),
            TextInput::make('telegram_url')->label('Ссылка Telegram (пусто — использовать ссылку лендинга)')->url()->nullable(),
        ]);
    }
    public static function table(Table $table): Table {
        return $table->columns([TextColumn::make('title')->label('Форма'), TextColumn::make('updated_at')->label('Обновлено')->dateTime('d.m.Y H:i')])
            ->recordActions([EditAction::make()->label('Редактировать')]);
    }
    public static function getPages(): array {
        return ['index'=>ListMailingFormSettings::route('/'),'edit'=>EditMailingFormSetting::route('/{record}/edit')];
    }
}
