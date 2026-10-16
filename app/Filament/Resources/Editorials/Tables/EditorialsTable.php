<?php

namespace App\Filament\Resources\Editorials\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\EditAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

class EditorialsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([

                TextColumn::make('hero_title')
                    ->label('Заголовок первого экрана')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('author_name')
                    ->label('Имя автора')
                    ->sortable(),

                TextColumn::make('updated_at')->label('Дата обновления')
                    ->dateTime()
                    ->sortable(),
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
