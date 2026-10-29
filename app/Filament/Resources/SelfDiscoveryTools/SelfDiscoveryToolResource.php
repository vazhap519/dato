<?php

namespace App\Filament\Resources\SelfDiscoveryTools;

use App\Models\SelfDiscoveryTool;
use App\Filament\Resources\SelfDiscoveryTools\Pages\ListSelfDiscoveryTools;
use App\Filament\Resources\SelfDiscoveryTools\Pages\CreateSelfDiscoveryTool;
use App\Filament\Resources\SelfDiscoveryTools\Pages\EditSelfDiscoveryTool;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Support\Icons\Heroicon;

class SelfDiscoveryToolResource extends Resource
{
    protected static ?string $model = SelfDiscoveryTool::class;
    protected static ?string $modelLabel = 'направление';
    protected static ?string $pluralModelLabel = 'направления самопознания';
    protected static ?string $navigationLabel = 'Направления самопознания';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSparkles;
    protected static string|\UnitEnum|null $navigationGroup = 'Самопознание';
    protected static ?int $navigationSort = 10;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')->label('Название')->required()->maxLength(255),
            TextInput::make('slug')->label('Код направления')->required()->alphaDash()->unique(ignoreRecord: true)->maxLength(100)
                ->helperText('Например: emotions, dreams. Не меняй код уже опубликованного направления без необходимости.'),
            TextInput::make('subtitle')->label('Подзаголовок')->maxLength(255),
            Textarea::make('description')->label('Описание')->rows(4),
            TextInput::make('icon')->label('Иконка Material Symbols')->default('auto_awesome')->maxLength(60),
            TextInput::make('url')->label('Адрес инструмента')->maxLength(2048)
                ->helperText('Внутренняя ссылка, например /explore/emotions, либо https://...')
                ->rule('regex:~^(https?://|/)[^\\s]*$~'),
            TextInput::make('sort')->label('Порядок')->numeric()->minValue(0)->default(0),
            Toggle::make('is_published')->label('Показывать на сайте')->default(false)
                ->helperText('Публикуй только направления с работающей ссылкой.'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('sort')->reorderable('sort')->columns([
            TextColumn::make('title')->label('Направление')->searchable(),
            TextColumn::make('slug')->label('Код'),
            TextColumn::make('url')->label('Ссылка')->limit(45),
            TextColumn::make('sort')->label('Порядок')->sortable(),
            IconColumn::make('is_published')->label('Опубликовано')->boolean(),
        ])->recordActions([EditAction::make(), DeleteAction::make()])
          ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSelfDiscoveryTools::route('/'),
            'create' => CreateSelfDiscoveryTool::route('/create'),
            'edit' => EditSelfDiscoveryTool::route('/{record}/edit'),
        ];
    }
}
