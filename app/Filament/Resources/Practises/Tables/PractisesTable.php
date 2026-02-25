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
                    ->label('Main Header')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('header_small')
                    ->label('Sub Header')
                    ->limit(40),

                TextColumn::make('contents_count')
                    ->counts('contents')
                    ->label('Practise Items'),

                TextColumn::make('updated_at')
                    ->label('Updated')
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
