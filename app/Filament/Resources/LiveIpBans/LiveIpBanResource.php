<?php
namespace App\Filament\Resources\LiveIpBans;

use App\Models\LiveIpBan;
use App\Filament\Resources\LiveIpBans\Pages\ListLiveIpBans;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\DeleteAction;

class LiveIpBanResource extends Resource {
    protected static ?string $model = LiveIpBan::class;
    protected static ?string $navigationLabel = 'Блокировки чата';
    protected static ?string $modelLabel = 'блокировка';
    protected static ?string $pluralModelLabel = 'блокировки чата';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShieldExclamation;
    public static function form(Schema $schema): Schema { return $schema; }
    public static function table(Table $table): Table {
        return $table->columns([
            TextColumn::make('id')->label('№'),
            TextColumn::make('ip_hash')->label('Идентификатор IP')->limit(16)->copyable(),
            TextColumn::make('reason')->label('Причина'),
            TextColumn::make('expires_at')->label('До')->dateTime('d.m.Y H:i')->placeholder('Бессрочно'),
            TextColumn::make('created_at')->label('Заблокирован')->dateTime('d.m.Y H:i'),
        ])->recordActions([
            DeleteAction::make()->label('Разблокировать')->requiresConfirmation(),
        ]);
    }
    public static function getPages(): array { return ['index'=>ListLiveIpBans::route('/')]; }
}
