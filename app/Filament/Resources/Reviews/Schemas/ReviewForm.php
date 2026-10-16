<?php

namespace App\Filament\Resources\Reviews\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Schemas\Components\Section;


class ReviewForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                TextInput::make('review_sm_header')
                    ->label('Небольшой заголовок раздела отзывов'),

                TextInput::make('review_xl_header')
                    ->label('Основной заголовок раздела отзывов'),

                Repeater::make('content')->label('Отзывы')
    ->default([]) // 🔥 აუცილებელია
    ->schema([
        Textarea::make('description')->label('Текст отзыва')
            ->required()
            ->columnSpanFull(),

        TextInput::make('name')->label('Имя'),

        TextInput::make('lastname')->label('Фамилия'),

        TextInput::make('position')->label('Должность или статус'),

        SpatieMediaLibraryFileUpload::make('u_image')->label('Фотография автора отзыва')
            ->collection('u_image')
            ->disk('public')
            ->image()
            ->conversion('webp')
            ->responsiveImages(),
    ])
    ->columns(2)
    ->reorderable()
    ->collapsible()
    ->columnSpanFull(),


            ]);
    }
}
