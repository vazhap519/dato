<?php

namespace App\Filament\Resources\UsefulLinks;

use App\Filament\Resources\UsefulLinks\Pages\CreateUsefulLink;
use App\Filament\Resources\UsefulLinks\Pages\EditUsefulLink;
use App\Filament\Resources\UsefulLinks\Pages\ListUsefulLinks;
use App\Models\UsefulLink;
use BackedEnum;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use UnitEnum;

class UsefulLinkResource extends Resource
{
    protected static ?string $model = UsefulLink::class;
    protected static ?string $modelLabel = 'полезная ссылка';
    protected static ?string $pluralModelLabel = 'полезные ссылки';
    protected static ?string $navigationLabel = 'Полезные ссылки';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedLink;
    protected static string|UnitEnum|null $navigationGroup = 'Главная';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')->label('Название')->required()->maxLength(255),
            Textarea::make('description')->label('Описание')->rows(2)->maxLength(255),
            TextInput::make('url')->label('Адрес ссылки')->required()->maxLength(2048)
                ->helperText('Например: https://t.me/... или /editoria')
                ->rule('regex:~^(https?://|/)[^\\s]*$~'),
            Select::make('icon')->label('Иконка')->default('link')->options([
                'link' => 'Ссылка', 'school' => 'Практикум', 'groups' => 'Сообщество',
                'menu_book' => 'Книги', 'chat' => 'Консультация',
                'send' => 'Telegram', 'smart_display' => 'YouTube',
                'photo_camera' => 'Instagram', 'music_note' => 'TikTok',
                'public' => 'Сайт',
            ]),
            TextInput::make('sort')->label('Порядок')->numeric()->default(0)->minValue(0),
            Toggle::make('is_active')->label('Показывать на странице')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('sort')
            ->reorderable('sort')
            ->columns([
                TextColumn::make('title')->label('Название')->searchable(),
                TextColumn::make('url')->label('Ссылка')->limit(45),
                TextColumn::make('sort')->label('Порядок')->sortable(),
                IconColumn::make('is_active')->label('Показывать')->boolean(),
            ])
            ->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListUsefulLinks::route('/'),
            'create' => CreateUsefulLink::route('/create'),
            'edit' => EditUsefulLink::route('/{record}/edit'),
        ];
    }
}
