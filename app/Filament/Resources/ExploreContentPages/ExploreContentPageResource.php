<?php

namespace App\Filament\Resources\ExploreContentPages;

use App\Filament\Resources\ExploreContentPages\Pages\EditExploreContentPage;
use App\Filament\Resources\ExploreContentPages\Pages\ListExploreContentPages;
use App\Models\ExploreContentPage;
use BackedEnum;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Actions\EditAction;
use Filament\Support\Icons\Heroicon;

class ExploreContentPageResource extends Resource
{
    protected static ?string $model = ExploreContentPage::class;
    protected static ?string $navigationLabel = 'Тексты страниц';
    protected static ?string $modelLabel = 'страница самопознания';
    protected static ?string $pluralModelLabel = 'тексты страниц самопознания';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;
    protected static string|\UnitEnum|null $navigationGroup = 'Самопознание';
    protected static ?int $navigationSort = 31;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')->label('Название страницы')->required(),
            TextInput::make('slug')->label('Системный код')->disabled(),
            KeyValue::make('copy')->label('Текстовые элементы')
                ->keyLabel('Ключ текста')
                ->valueLabel('Текст на странице')
                ->addActionLabel('Добавить текст')
                ->helperText('Меняйте существующие значения. Ключи служат для связи с отображением на сайте.'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('title')->label('Раздел')->searchable(),
            TextColumn::make('slug')->label('Код'),
        ])->recordActions([EditAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListExploreContentPages::route('/'),
            'edit' => EditExploreContentPage::route('/{record}/edit'),
        ];
    }
}
