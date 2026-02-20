<?php

namespace App\Filament\Resources\HomeHeroes;

use App\Filament\Resources\HomeHeroes\Pages\CreateHomeHero;
use App\Filament\Resources\HomeHeroes\Pages\EditHomeHero;
use App\Filament\Resources\HomeHeroes\Pages\ListHomeHeroes;
use App\Filament\Resources\HomeHeroes\Schemas\HomeHeroForm;
use App\Filament\Resources\HomeHeroes\Tables\HomeHeroesTable;
use App\Models\HomeHero;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;


class HomeHeroResource extends Resource
{
    protected static ?string $model = HomeHero::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return HomeHeroForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return HomeHeroesTable::configure($table);
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
            'index' => ListHomeHeroes::route('/'),
            'create' => CreateHomeHero::route('/create'),
            'edit' => EditHomeHero::route('/{record}/edit'),
        ];
    }
}
