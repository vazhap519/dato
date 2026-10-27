<?php

namespace App\Filament\Resources\HomeAboutSections;

use App\Filament\Resources\HomeAboutSections\Pages\CreateHomeAboutSection;
use App\Filament\Resources\HomeAboutSections\Pages\EditHomeAboutSection;
use App\Filament\Resources\HomeAboutSections\Pages\ListHomeAboutSections;
use App\Filament\Resources\HomeAboutSections\Schemas\HomeAboutSectionForm;
use App\Filament\Resources\HomeAboutSections\Tables\HomeAboutSectionsTable;
use App\Models\HomeAboutSection;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class HomeAboutSectionResource extends Resource
{
    protected static string | \UnitEnum | null $navigationGroup = 'Управление сайтом';
    protected static ?int $navigationSort = 20;

    protected static ?string $model = HomeAboutSection::class;
    protected static ?string $modelLabel = 'блок «О нас»';
    protected static ?string $pluralModelLabel = 'блоки «О нас»';
    protected static ?string $navigationLabel = 'Блоки «О нас»';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;


    public static function form(Schema $schema): Schema
    {
        return HomeAboutSectionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return HomeAboutSectionsTable::configure($table);
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
            'index' => ListHomeAboutSections::route('/'),
            'create' => CreateHomeAboutSection::route('/create'),
            'edit' => EditHomeAboutSection::route('/{record}/edit'),
        ];
    }
}
