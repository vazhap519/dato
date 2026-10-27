<?php

namespace App\Filament\Resources\ContactSections;

use App\Filament\Resources\ContactSections\Pages\CreateContactSection;
use App\Filament\Resources\ContactSections\Pages\EditContactSection;
use App\Filament\Resources\ContactSections\Pages\ListContactSections;
use App\Filament\Resources\ContactSections\Schemas\ContactSectionForm;
use App\Filament\Resources\ContactSections\Tables\ContactSectionsTable;
use App\Models\ContactSection;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;
class ContactSectionResource extends Resource
{
    protected static string | \UnitEnum | null $navigationGroup = 'Управление сайтом';
    protected static ?int $navigationSort = 30;
    protected static ?string $model = ContactSection::class;
    protected static ?string $modelLabel = 'контактный раздел';
    protected static ?string $pluralModelLabel = 'контактные разделы';
    protected static ?string $navigationLabel = 'Контактные разделы';
    protected static string | UnitEnum | null $navigationGroup = 'Главная';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return ContactSectionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ContactSectionsTable::configure($table);
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
            'index' => ListContactSections::route('/'),
            'create' => CreateContactSection::route('/create'),
            'edit' => EditContactSection::route('/{record}/edit'),
        ];
    }
}
