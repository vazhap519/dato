<?php

namespace App\Filament\Resources\Footers\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class FootersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('brand_name'),
                TextColumn::make('description'),
                TextColumn::make('nav_title'),

                TextColumn::make('support_title'),
                TextColumn::make('support_faq'),
                TextColumn::make('support_payment'),
                TextColumn::make('support_privacy'),
                TextColumn::make('support_offer'),
                TextColumn::make('Contact_title'),
                TextColumn::make('email'),
                TextColumn::make('location'),
                TextColumn::make('copyright'),
                TextColumn::make('youtube'),
                TextColumn::make('telegram'),
                TextColumn::make('tiktok'),
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
