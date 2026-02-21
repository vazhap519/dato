<?php

namespace App\Filament\Resources\Practises;

use App\Filament\Resources\Practises\Pages\CreatePractise;
use App\Filament\Resources\Practises\Pages\EditPractise;
use App\Filament\Resources\Practises\Pages\ListPractises;
use App\Filament\Resources\Practises\Schemas\PractiseForm;
use App\Filament\Resources\Practises\Tables\PractisesTable;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use App\Models\Practice;

class PractiseResource extends Resource
{
    protected static ?string $model = Practice::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return PractiseForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PractisesTable::configure($table);
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
            'index' => ListPractises::route('/'),
            'create' => CreatePractise::route('/create'),
            'edit' => EditPractise::route('/{record}/edit'),
        ];
    }
}
