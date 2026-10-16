<?php

namespace App\Filament\Resources\Practises\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\EditAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

class PractisesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([

                TextColumn::make('header_big')
                    ->label('Основной заголовок')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('header_small')
                    ->label('Подзаголовок')
                    ->limit(40),

                TextColumn::make('contents_count')
                    ->label('Количество практик'),

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
