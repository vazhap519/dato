<?php

namespace App\Filament\Resources\Personals;

use App\Filament\Resources\Personals\Pages\CreatePersonal;
use App\Filament\Resources\Personals\Pages\EditPersonal;
use App\Filament\Resources\Personals\Pages\ListPersonals;
use App\Filament\Resources\Personals\Schemas\PersonalForm;
use App\Filament\Resources\Personals\Tables\PersonalsTable;
use App\Models\Personal;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PersonalResource extends Resource
{
    protected static ?string $model = Personal::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'Personal';

    public static function form(Schema $schema): Schema
    {
        return PersonalForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PersonalsTable::configure($table);
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
            'index' => ListPersonals::route('/'),
            'create' => CreatePersonal::route('/create'),
            'edit' => EditPersonal::route('/{record}/edit'),
        ];
    }
}
