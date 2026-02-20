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
                    ->label('Image')
                    ->state(function ($record) {
                        /** @var \App\Models\HomeAboutSection $record */
                        return $record->aboutImageUrl();
                    })
                    ->circular()
                    ->size(48),

                TextColumn::make('kicker')
                    ->label('Kicker')
                    ->searchable()
                    ->sortable()
                    ->limit(30),

                TextColumn::make('title')
                    ->label('Title')
                    ->searchable()
                    ->limit(50),

                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->dateTime('Y-m-d H:i')
                    ->sortable(),

            ])
            ->filters([

                TernaryFilter::make('is_active')
                    ->label('Active')
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
