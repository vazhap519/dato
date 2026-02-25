<?php

namespace App\Filament\Resources\Personals\Tables;


use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;


class PersonalsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([

                TextColumn::make('id')
                    ->sortable(),

                TextColumn::make('hero_title_line_1')
                    ->label('Hero Title')
                    ->searchable()
                    ->limit(30),

                TextColumn::make('pricing_amount')
                    ->label('Price')
                    ->sortable(),
ImageColumn::make('hero_image')
    ->label('Hero Image')
    ->circular(),
                TextColumn::make('pricing_currency')
                    ->label('Currency'),

                TextColumn::make('updated_at')
                    ->label('Last Updated')
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
