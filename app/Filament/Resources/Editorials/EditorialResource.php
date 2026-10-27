<?php

namespace App\Filament\Resources\Editorials;

use App\Filament\Resources\Editorials\Pages\CreateEditorial;
use App\Filament\Resources\Editorials\Pages\EditEditorial;
use App\Filament\Resources\Editorials\Pages\ListEditorials;
use App\Filament\Resources\Editorials\Schemas\EditorialForm;
use App\Filament\Resources\Editorials\Tables\EditorialsTable;
use App\Models\Editorial;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class EditorialResource extends Resource
{
    protected static string | \UnitEnum | null $navigationGroup = 'Продукты и услуги';
    protected static ?int $navigationSort = 50;

    protected static ?string $model = Editorial::class;
    protected static ?string $modelLabel = 'статья';
    protected static ?string $pluralModelLabel = 'статьи';
    protected static ?string $navigationLabel = 'Страница Практикума';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return EditorialForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return EditorialsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListEditorials::route('/'),
            'create' => CreateEditorial::route('/create'),
            'edit' => EditEditorial::route('/{record}/edit'),
        ];
    }
}
