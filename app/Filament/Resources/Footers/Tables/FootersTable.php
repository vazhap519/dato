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
                TextColumn::make('brand_name')->label('Название бренда'),
                TextColumn::make('description')->label('Описание'),
                TextColumn::make('nav_title')->label('Заголовок навигации'),

                TextColumn::make('support_title')->label('Заголовок раздела помощи'),
                TextColumn::make('support_faq')->label('Ссылка на вопросы и ответы'),
                TextColumn::make('support_payment')->label('Ссылка на оплату'),
                TextColumn::make('support_privacy')->label('Ссылка на политику конфиденциальности'),
                TextColumn::make('support_offer')->label('Ссылка на оферту'),
                TextColumn::make('Contact_title')->label('Заголовок контактов'),
                TextColumn::make('email')->label('Электронная почта'),
                TextColumn::make('location')->label('Местоположение'),
                TextColumn::make('copyright')->label('Текст об авторских правах'),
                TextColumn::make('youtube')->label('Ссылка на YouTube'),
                TextColumn::make('telegram')->label('Ссылка на Telegram'),
                TextColumn::make('tiktok')->label('Ссылка на TikTok'),
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
