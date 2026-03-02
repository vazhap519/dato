<?php

namespace App\Filament\Resources\ClosedGroups;

use App\Filament\Resources\ClosedGroups\Pages\CreateClosedGroup;
use App\Filament\Resources\ClosedGroups\Pages\EditClosedGroup;
use App\Filament\Resources\ClosedGroups\Pages\ListClosedGroups;
use App\Filament\Resources\ClosedGroups\Schemas\ClosedGroupForm;
use App\Filament\Resources\ClosedGroups\Tables\ClosedGroupsTable;
use App\Models\ClosedGroup;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ClosedGroupResource extends Resource
{
    protected static ?string $model = ClosedGroup::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'ClosedGroup';

    public static function form(Schema $schema): Schema
    {
        return ClosedGroupForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ClosedGroupsTable::configure($table);
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
            'index' => ListClosedGroups::route('/'),
            'create' => CreateClosedGroup::route('/create'),
            'edit' => EditClosedGroup::route('/{record}/edit'),
        ];
    }
}
