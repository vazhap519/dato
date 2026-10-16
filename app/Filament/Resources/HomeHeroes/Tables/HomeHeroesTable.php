<?php

namespace App\Filament\Resources\HomeHeroes\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

class HomeHeroesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([

                ImageColumn::make('hero_image')
                    ->label('Изображение первого экрана')
                    ->circular(),

                TextColumn::make('badge_text')
                    ->label('Текст бейджа')
                    ->searchable(),

                TextColumn::make('title_line_1')
                    ->label('Первая строка заголовка')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('title_highlight')
                    ->label('Выделенная часть заголовка'),

                TextColumn::make('primary_button_text')
                    ->label('Текст основной кнопки'),

                IconColumn::make('is_active')
                    ->label('Активно')
                    ->boolean(),

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
