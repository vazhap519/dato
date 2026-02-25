<?php

namespace App\Filament\Resources\Legals\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

class LegalsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([

                TextColumn::make('title')
                    ->label('Page Title')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('privacy_title')
                    ->label('Privacy')
                    ->limit(30),

                TextColumn::make('agreement_title')
                    ->label('Agreement')
                    ->limit(30),

                TextColumn::make('offer_title')
                    ->label('Offer')
                    ->limit(30),

                TextColumn::make('details_title')
                    ->label('Details')
                    ->limit(30),

                TextColumn::make('cta_title')
                    ->label('CTA')
                    ->limit(30),

                TextColumn::make('sections_nav')
                    ->label('Nav Sections')
                    ->formatStateUsing(fn ($state) => is_array($state) ? count($state) : 0),

                TextColumn::make('company_details')
                    ->label('Company Fields')
                    ->formatStateUsing(fn ($state) => is_array($state) ? count($state) : 0),

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
