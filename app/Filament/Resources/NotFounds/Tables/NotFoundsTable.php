<?php

namespace App\Filament\Resources\NotFounds\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class NotFoundsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('not_found_title')->label('Заголовок страницы 404')->searchable(),
                TextColumn::make('not_found_button_text')->label('Текст кнопки возврата')->searchable(),
                TextColumn::make('not_found_content')->label('Текст страницы 404')
                ->searchable()
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
