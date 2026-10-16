<?php

namespace App\Filament\Resources\Legals\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

class LegalsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([

                TextColumn::make('title')
                    ->label('Заголовок')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('privacy_title')
                    ->label('Заголовок политики конфиденциальности')
                    ->limit(30),

                TextColumn::make('agreement_title')
                    ->label('Заголовок пользовательского соглашения')
                    ->limit(30),

                TextColumn::make('offer_title')
                    ->label('Заголовок публичной оферты')
                    ->limit(30),

                TextColumn::make('details_title')
                    ->label('Заголовок реквизитов')
                    ->limit(30),

                TextColumn::make('cta_title')
                    ->label('Заголовок заключительного блока')
                    ->limit(30),

                TextColumn::make('sections_nav')
                    ->label('Разделы боковой навигации')
                    ->formatStateUsing(fn ($state) => is_array($state) ? count($state) : 0),

                TextColumn::make('company_details')
                    ->label('Реквизиты организации')
                    ->formatStateUsing(fn ($state) => is_array($state) ? count($state) : 0),

                TextColumn::make('updated_at')
                    ->label('Дата обновления')
                    ->dateTime()
                    ->sortable(),

            ])

            ->filters([
                //
            ])

            ->recordActions([
                EditAction::make(),
            ])

            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
