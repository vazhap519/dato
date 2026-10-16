<?php

namespace App\Filament\Resources\LandingPages\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class LandingPagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('label')
                    ->label('Название ссылки')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('key')
                    ->label('Идентификатор страницы')
                    ->badge()
                    ->sortable()
                    ->searchable(),

                TextColumn::make('navigation_items_count')
                    ->label('Количество ссылок навигации')
                    ->sortable(),

                TextColumn::make('updated_at')
                    ->label('Дата обновления')
                    ->dateTime('Y-m-d H:i')
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
