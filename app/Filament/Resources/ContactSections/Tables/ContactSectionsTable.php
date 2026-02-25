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
                    ->label('Title')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('description')
                    ->limit(50)
                    ->label('Description'),

                TextColumn::make('questions')
                    ->label('Questions Count')
                    ->formatStateUsing(fn ($state) => is_array($state) ? count($state) : 0),

                TextColumn::make('button_text')
                    ->label('Button Text'),

                TextColumn::make('button_url')
                    ->label('Button Link')
                    ->limit(30),

                ImageColumn::make('contact_image')
                    ->label('Image')
                    ->circular(),

                TextColumn::make('updated_at')
                    ->label('Last Updated')
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
