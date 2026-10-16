<?php

namespace App\Filament\Resources\HomeAboutSections\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;

use Filament\Tables\Filters\TernaryFilter;

class HomeAboutSectionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([

                // ✅ Spatie Media preview (if available)
                ImageColumn::make('about_image')
                    ->label('Изображение раздела «О нас»')
                    ->state(function ($record) {
                        /** @var \App\Models\HomeAboutSection $record */
                        return $record->aboutImageUrl();
                    })
                    ->circular(),


                TextColumn::make('kicker')
                    ->label('Надзаголовок')
                    ->searchable()
                    ->sortable()
                    ->limit(30),

                TextColumn::make('title')
                    ->label('Заголовок')
                    ->searchable()
                    ->limit(50),

                IconColumn::make('is_active')
                    ->label('Активно')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('updated_at')
                    ->label('Дата обновления')
                    ->dateTime('Y-m-d H:i')
                    ->sortable(),

            ])
            ->filters([

                TernaryFilter::make('is_active')
                    ->label('Активно')
                    ->trueLabel('Active only')
                    ->falseLabel('Inactive only')

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
