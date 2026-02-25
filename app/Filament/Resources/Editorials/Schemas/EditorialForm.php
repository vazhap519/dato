<?php

namespace App\Filament\Resources\Editorials\Schemas;

use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;

class EditorialForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                /*
                |--------------------------------------------------------------------------
                | HERO SECTION
                |--------------------------------------------------------------------------
                */
                Section::make('Hero Section')
                    ->schema([

                        TextInput::make('hero_badge')
                            ->label('Hero Badge'),

                        TextInput::make('hero_title')
                            ->label('Hero Title')
                            ->required(),

                        Textarea::make('hero_description')
                            ->rows(3),

                        TextInput::make('hero_button_text'),
                        TextInput::make('hero_button_url'),

                        SpatieMediaLibraryFileUpload::make('hero_image')
                            ->collection('hero_image')
                            ->image()
                            ->disk('public')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | QUOTE
                |--------------------------------------------------------------------------
                */
                Section::make('Quote Section')
                    ->schema([
                        Textarea::make('quote_text')->rows(3),
                        TextInput::make('quote_button_text'),
                    ]),

                /*
                |--------------------------------------------------------------------------
                | INFO BLOCKS
                |--------------------------------------------------------------------------
                */
                Section::make('Info Blocks')
                    ->schema([
                        Repeater::make('info_blocks')
                            ->schema([
                                TextInput::make('title')->required(),
                                TextInput::make('description')->required(),
                            ])
                            ->reorderable()
                            ->collapsible()
                            ->columnSpanFull(),
                    ]),

                /*
                |--------------------------------------------------------------------------
                | PROGRAM DAYS
                |--------------------------------------------------------------------------
                */
                Section::make('Program Days')
                    ->schema([
                        Repeater::make('program_days')
                            ->schema([
                                TextInput::make('day_label')->label('Day Label'),
                                TextInput::make('title')->required(),
                                Textarea::make('description')->rows(3),
                            ])
                            ->reorderable()
                            ->collapsible()
                            ->columnSpanFull(),
                    ]),

                /*
                |--------------------------------------------------------------------------
                | FOR WHOM
                |--------------------------------------------------------------------------
                */
                Section::make('For Whom Section')
                    ->schema([

                        TextInput::make('for_whom_title'),
                        Textarea::make('for_whom_description')->rows(3),

                        Repeater::make('for_whom_list')
                            ->schema([
                                TextInput::make('text')->required(),
                            ])
                            ->reorderable()
                            ->collapsible(),

                        SpatieMediaLibraryFileUpload::make('for_whom_image')
                            ->collection('for_whom_image')
                            ->image()
                            ->disk('public')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | WHY SECTION
                |--------------------------------------------------------------------------
                */
                Section::make('Why Section')
                    ->schema([
                        TextInput::make('why_title'),
                        Textarea::make('why_description')->rows(3),
                        TextInput::make('why_button_text'),
                    ]),

                /*
                |--------------------------------------------------------------------------
                | AUTHOR SECTION
                |--------------------------------------------------------------------------
                */
                Section::make('Author Section')
                    ->schema([

                        TextInput::make('author_name'),
                        Textarea::make('author_quote')->rows(3),

                        Repeater::make('author_points')
                            ->schema([
                                TextInput::make('text')->required(),
                            ])
                            ->reorderable()
                            ->collapsible(),

                        TextInput::make('author_button_text'),

                        SpatieMediaLibraryFileUpload::make('author_image')
                            ->collection('author_image')
                            ->image()
                            ->disk('public')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | FINAL CTA
                |--------------------------------------------------------------------------
                */
                Section::make('Final CTA')
                    ->schema([
                        TextInput::make('cta_title'),
                        Textarea::make('cta_description')->rows(3),
                        TextInput::make('cta_button_text'),
                    ]),
            ]);
    }
}
