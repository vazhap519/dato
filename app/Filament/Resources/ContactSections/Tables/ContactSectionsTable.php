<?php

namespace App\Filament\Resources\ContactSections\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Actions\EditAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

class ContactSectionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([

                TextColumn::make('title')
                    ->label('Заголовок')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('description')
                    ->label('Описание')
                    ->limit(50),

                TextColumn::make('questions')
                    ->label('Вопросы')
                    ->formatStateUsing(fn ($state) => is_array($state) ? count($state) : 0),

                TextColumn::make('button_text')
                    ->label('Текст кнопки'),

                TextColumn::make('button_url')
                    ->label('Ссылка кнопки')
                    ->limit(30),

                ImageColumn::make('contact_image')
                    ->label('Изображение блока контактов')
                    ->circular(),

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
