<?php

namespace App\Filament\Resources\Personals\Schemas;




use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Schema;
class PersonalForm
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

                        Grid::make(2)->schema([
                            TextInput::make('hero_badge'),

                            TextInput::make('hero_author_name'),
                        ]),

                        Grid::make(3)->schema([
                            TextInput::make('hero_title_line_1'),
                            TextInput::make('hero_title_highlight'),
                            TextInput::make('hero_title_line_2'),
                        ]),

                        Textarea::make('hero_description')
                            ->rows(4)
                            ->columnSpanFull(),

                        Grid::make(2)->schema([
                            TextInput::make('hero_primary_button_text'),
                            TextInput::make('hero_primary_button_url')->url(),
                        ]),

                        Grid::make(2)->schema([
                            TextInput::make('hero_secondary_button_text'),
                            TextInput::make('hero_secondary_button_url')->url(),
                        ]),

                        TextInput::make('hero_author_role'),

                        SpatieMediaLibraryFileUpload::make('hero_image')
                            ->collection('hero_image')
                            ->disk('public')
                            ->image()
                            ->imageEditor()
                            ->responsiveImages()
                            ->conversion('webp')
                            ->maxSize(2048)
                            ->columnSpanFull(),
                    ])
                    ->columns(1),

                /*
                |--------------------------------------------------------------------------
                | HOW SECTION
                |--------------------------------------------------------------------------
                */
                Section::make('How Section')
                    ->schema([

                        Grid::make(2)->schema([
                            TextInput::make('how_title_line_1'),
                            TextInput::make('how_title_highlight'),
                        ]),

                        Textarea::make('how_description')
                            ->rows(4)
                            ->columnSpanFull(),

                        Repeater::make('how_items')
                            ->schema([
                                TextInput::make('title')->required(),
                                Textarea::make('description')->rows(3),
                            ])
                            ->reorderable()
                            ->collapsible()
                            ->columnSpanFull(),
                    ]),

                /*
                |--------------------------------------------------------------------------
                | STEPS SECTION
                |--------------------------------------------------------------------------
                */
                Section::make('Steps Section')
                    ->schema([

                        TextInput::make('steps_title'),
                        TextInput::make('steps_subtitle'),

                        Repeater::make('steps_items')
                            ->schema([
                                TextInput::make('title')->required(),
                                Textarea::make('description')->rows(3),
                            ])
                            ->reorderable()
                            ->collapsible()
                            ->columnSpanFull(),

                        SpatieMediaLibraryFileUpload::make('steps_images')
                            ->collection('steps_images')
                            ->disk('public')
                            ->multiple()
                            ->image()
                            ->imageEditor()
                            ->responsiveImages()
                            ->conversion('webp')
                            ->maxSize(2048)
                            ->columnSpanFull(),
                    ]),

                /*
                |--------------------------------------------------------------------------
                | PRICING SECTION
                |--------------------------------------------------------------------------
                */
                Section::make('Pricing Section')
                    ->schema([

                        TextInput::make('pricing_title'),

                        Grid::make(2)->schema([
                            TextInput::make('pricing_amount'),
                            TextInput::make('pricing_currency'),
                        ]),

                        Repeater::make('pricing_features')
                            ->schema([
                                TextInput::make('feature')->required(),
                            ])
                            ->reorderable()
                            ->collapsible()
                            ->columnSpanFull(),

                        Grid::make(2)->schema([
                            TextInput::make('pricing_button_text'),
                            TextInput::make('pricing_button_url')->url(),
                        ]),
                    ]),

                /*
                |--------------------------------------------------------------------------
                | FAQ SECTION
                |--------------------------------------------------------------------------
                */
                Section::make('FAQ Section')
                    ->schema([

                        TextInput::make('faq_title'),

                        Repeater::make('faq_items')
                            ->schema([
                                TextInput::make('question')->required(),
                                Textarea::make('answer')->rows(4)->required(),
                            ])
                            ->reorderable()
                            ->collapsible()
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
