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
                    ->label('Small Header'),

                TextInput::make('review_xl_header')
                    ->label('Main Header'),

                Repeater::make('content')
    ->default([]) // 🔥 აუცილებელია
    ->schema([
        Textarea::make('description')
            ->required()
            ->columnSpanFull(),

        TextInput::make('name'),

        TextInput::make('lastname'),

        TextInput::make('position'),

        SpatieMediaLibraryFileUpload::make('u_image')
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
