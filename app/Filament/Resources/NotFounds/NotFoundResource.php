<?php

namespace App\Filament\Resources\NotFounds;

use App\Filament\Resources\NotFounds\Pages\CreateNotFound;
use App\Filament\Resources\NotFounds\Pages\EditNotFound;
use App\Filament\Resources\NotFounds\Pages\ListNotFounds;
use App\Filament\Resources\NotFounds\Schemas\NotFoundForm;
use App\Filament\Resources\NotFounds\Tables\NotFoundsTable;
use App\Models\NotFound;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;


class NotFoundResource extends Resource
{
    protected static ?string $model = NotFound::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return NotFoundForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return NotFoundsTable::configure($table);
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
            'index' => ListNotFounds::route('/'),
            'create' => CreateNotFound::route('/create'),
            'edit' => EditNotFound::route('/{record}/edit'),
        ];
    }
}
