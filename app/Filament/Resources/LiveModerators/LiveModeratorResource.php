<?php

namespace App\Filament\Resources\LiveModerators;

use App\Filament\Resources\LiveModerators\Pages\CreateLiveModerator;
use App\Filament\Resources\LiveModerators\Pages\EditLiveModerator;
use App\Filament\Resources\LiveModerators\Pages\ListLiveModerators;
use App\Models\LiveModerator;
use BackedEnum;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Hash;

class LiveModeratorResource extends Resource {
    protected static ?string $model = LiveModerator::class;
    protected static ?string $modelLabel = 'модератор';
    protected static ?string $pluralModelLabel = 'модераторы эфира';
    protected static ?string $navigationLabel = 'Модераторы эфира';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShieldCheck;

    public static function form(Schema $schema): Schema {
        return $schema->components([
            TextInput::make('login')->label('Логин')->required()->unique(ignoreRecord: true)->maxLength(80),
            TextInput::make('password')->label('Пароль (оставьте пустым при редактировании, чтобы сохранить текущий)')
                ->password()->revealable()->required(fn (string $operation): bool => $operation === 'create')
                ->dehydrated(fn ($state): bool => filled($state))
                ->dehydrateStateUsing(fn ($state) => Hash::make($state))->minLength(12),
            CheckboxList::make('permissions')->label('Разрешённые действия')->options(LiveModerator::PERMISSIONS)->columns(2)->required(),
            Toggle::make('is_active')->label('Активен')->default(true),
        ]);
    }
    public static function table(Table $table): Table {
        return $table->columns([
            TextColumn::make('login')->label('Логин')->searchable(),
            IconColumn::make('is_active')->label('Активен')->boolean(),
            TextColumn::make('permissions')->label('Права')->formatStateUsing(fn ($state) => is_array($state) ? count($state).' разрешений' : ''),
        ])->recordActions([\Filament\Actions\EditAction::make()]);
    }
    public static function getPages(): array {
        return ['index'=>ListLiveModerators::route('/'), 'create'=>CreateLiveModerator::route('/create'), 'edit'=>EditLiveModerator::route('/{record}/edit')];
    }
}
