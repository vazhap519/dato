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
                    ->label('Image')
                    ->circular(),

                TextColumn::make('badge_text')
                    ->label('Badge')
                    ->searchable(),

                TextColumn::make('title_line_1')
                    ->label('Title')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('title_highlight')
                    ->label('Highlight'),

                TextColumn::make('primary_button_text')
                    ->label('Primary Button'),

                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean(),

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
