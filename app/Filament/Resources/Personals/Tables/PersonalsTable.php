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

                TextColumn::make('id')->label('ID')
                    ->sortable(),

                TextColumn::make('hero_title_line_1')
                    ->label('Первая строка заголовка')
                    ->searchable()
                    ->limit(30),

                TextColumn::make('pricing_amount')
                    ->label('Стоимость')
                    ->sortable(),
ImageColumn::make('hero_image')
    ->label('Изображение первого экрана')
    ->circular(),
                TextColumn::make('pricing_currency')
                    ->label('Валюта'),

                TextColumn::make('updated_at')
                    ->label('Дата обновления')
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
