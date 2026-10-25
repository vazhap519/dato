<?php

namespace App\Filament\Resources\MailingDeliveries;

use App\Filament\Resources\MailingDeliveries\Pages\ListMailingDeliveries;
use App\Models\MailingDelivery;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class MailingDeliveryResource extends Resource
{
    protected static ?string $model = MailingDelivery::class;
    protected static ?string $navigationLabel = 'История отправок';
    protected static ?string $pluralModelLabel = 'История отправок';
    protected static \UnitEnum|string|null $navigationGroup = 'Рассылка';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClock;
    protected static ?int $navigationSort = 2;
    public static function form(Schema $schema): Schema { return $schema; }
    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('contact.email')->label('Получатель')->searchable(),
            TextColumn::make('type')->label('Тип'),
            TextColumn::make('practice_date')->label('Практикум')->date('d.m.Y'),
            TextColumn::make('status')->label('Статус')->badge(),
            TextColumn::make('error')->label('Ошибка')->limit(90)->wrap(),
            TextColumn::make('sent_at')->label('Отправлено')->dateTime('d.m.Y H:i'),
        ])->defaultSort('created_at', 'desc');
    }
    public static function getPages(): array { return ['index'=>ListMailingDeliveries::route('/')]; }
}
