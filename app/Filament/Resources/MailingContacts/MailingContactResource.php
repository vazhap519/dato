<?php

namespace App\Filament\Resources\MailingContacts;

use App\Filament\Resources\MailingContacts\Pages\ListMailingContacts;
use App\Models\MailingContact;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Filters\TernaryFilter;

class MailingContactResource extends Resource
{
    protected static ?string $model = MailingContact::class;
    protected static ?string $navigationLabel = 'Участники';
    protected static ?string $pluralModelLabel = 'Контакты рассылки';
    protected static ?string $modelLabel = 'Контакт';
    protected static \UnitEnum|string|null $navigationGroup = 'Рассылка';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedEnvelope;
    protected static ?int $navigationSort = 1;
    public static function form(Schema $schema): Schema { return $schema; }
    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')->label('Имя')->searchable(),
            TextColumn::make('email')->label('Email')->searchable()->copyable(),
            TextColumn::make('phone')->label('Телефон')->searchable(),
            TextColumn::make('source')->label('Источник'),
            IconColumn::make('practice_reminders')->label('Напоминания')->boolean(),
            IconColumn::make('marketing_consent')->label('Новости')->boolean(),
            TextColumn::make('unsubscribed_at')->label('Отписка')->dateTime('d.m.Y H:i'),
            TextColumn::make('created_at')->label('Регистрация')->dateTime('d.m.Y H:i')->sortable(),
        ])->filters([
            TernaryFilter::make('practice_reminders')->label('Напоминания'),
            TernaryFilter::make('marketing_consent')->label('Согласие на новости'),
        ])->defaultSort('created_at', 'desc');
    }
    public static function getPages(): array { return ['index'=>ListMailingContacts::route('/')]; }
}
