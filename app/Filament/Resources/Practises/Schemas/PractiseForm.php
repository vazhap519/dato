<?php

namespace App\Filament\Resources\Practises\Schemas;

use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Illuminate\Support\Str;

class PractiseForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                TextInput::make('header_big'),

                TextInput::make('header_small'),

                Repeater::make('contents')
                    ->relationship()
                    ->schema([

                        // TITLE
                        TextInput::make('title')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(function ($state, callable $set) {
                                $set('slug', Str::slug($state));
                            }),

                        // SLUG
                        TextInput::make('slug')
                            ->required()
                            ->disabled()
                            ->dehydrated() ->reactive(),

                        // ✅ აქ გადავიტანეთ
                        Select::make('closed_group_id')
                            ->relationship('closedGroup', 'hero_title')
                            ->searchable()
                            ->preload()
                            ->required(),

                        Textarea::make('description')->required(),

                        TextInput::make('price'),

                        SpatieMediaLibraryFileUpload::make('practice_images') // ⚠️ აქ არის შეცდომა შენთან
                        ->collection('practice_images')
                            ->image()
                            ->imageEditor()
                            ->conversion('webp')
                            ->responsiveImages()
                            ->disk('public') // აუცილებელია
                            ->visibility('public'),


                        Toggle::make('is_active')
                            ->default(true),
                    ])
                    ->columns(2)
                    ->reorderable()
                    ->collapsible()
                    ->columnSpanFull(),
            ]);
    }
}
