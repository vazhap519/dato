<?php

namespace App\Filament\Resources\Archetypes;

use App\Filament\Resources\Archetypes\Pages\ListArchetypes;
use App\Filament\Resources\Archetypes\Pages\CreateArchetype;
use App\Filament\Resources\Archetypes\Pages\EditArchetype;
use App\Models\Archetype;
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

class ArchetypeResource extends Resource
{
    protected static ?string $model = Archetype::class;
    protected static ?string $modelLabel = 'архетип';
    protected static ?string $pluralModelLabel = 'архетипы';
    protected static ?string $navigationLabel = 'Язык архетипов';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUserGroup;
    protected static string|\UnitEnum|null $navigationGroup = 'Самопознание';
    protected static ?int $navigationSort = 20;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')->label('Название')->required()->maxLength(255),
            TextInput::make('slug')->label('Код')->required()->alphaDash()->unique(ignoreRecord: true)->maxLength(100),
            TextInput::make('subtitle')->label('Короткая характеристика')->maxLength(255),
            TextInput::make('icon')->label('Иконка Material Symbols')->maxLength(60)->default('psychology'),
            Textarea::make('description')->label('Суть архетипа')->required()->rows(4),
            Textarea::make('strength')->label('Сильная сторона')->required()->rows(3),
            Textarea::make('shadow')->label('Теневая сторона')->required()->rows(3),
            Textarea::make('question')->label('Вопрос к себе')->required()->rows(3),
            Textarea::make('practice')->label('Практика внимания')->required()->rows(4),
            TextInput::make('sort')->label('Порядок')->numeric()->minValue(0)->default(0),
            Toggle::make('is_published')->label('Показывать на сайте')->default(false),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('sort')->reorderable('sort')->columns([
            TextColumn::make('title')->label('Архетип')->searchable(),
            TextColumn::make('subtitle')->label('Характеристика')->limit(45),
            TextColumn::make('sort')->label('Порядок')->sortable(),
            IconColumn::make('is_published')->label('Опубликован')->boolean(),
        ])->recordActions([EditAction::make(), DeleteAction::make()])
          ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListArchetypes::route('/'),
            'create' => CreateArchetype::route('/create'),
            'edit' => EditArchetype::route('/{record}/edit'),
        ];
    }
}
