<?php


namespace App\Filament\Resources\ClosedGroups\Schemas;

use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Illuminate\Support\Str;

class ClosedGroupForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                /* ===============================
                 * HERO SECTION
                 * =============================== */
                Section::make('Hero Section')
                    ->schema([
                        TextInput::make('hero_badge')
                            ->label('Badge'),

                        TextInput::make('hero_title')
                            ->label('Title')
                            ->live(onBlur: true)
                            ->afterStateUpdated(function ($state, callable $set) {
                                $set('slug', Str::slug($state));
                            }),

                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->disabled()
                            ->dehydrated()->reactive(),

                        TextInput::make('hero_title_highlight')
                            ->label('Title Highlight'),

                        Textarea::make('hero_description')
                            ->label('Description')
                            ->rows(4),

                        TextInput::make('hero_button_primary')
                            ->label('Primary Button Text'),

                        TextInput::make('hero_button_secondary')
                            ->label('Secondary Button Text'),

                        SpatieMediaLibraryFileUpload::make('hero_image')
                            ->collection('hero_image')
                            ->image()
                            ->label('Hero Image'),
                    ])
                    ->columns(2),

                /* ===============================
                 * CONDITIONS
                 * =============================== */
                Section::make('Conditions')
                    ->schema([
                        Repeater::make('conditions')
                            ->schema([
                                TextInput::make('label')
                                    ->required(),

                                TextInput::make('value')
                                    ->required(),
                            ])
                            ->defaultItems(3)
                            ->reorderable()
                            ->collapsible(),
                    ]),

                /* ===============================
                 * PROMO VIDEO
                 * =============================== */
                Section::make('Promo Video')
                    ->schema([
                        TextInput::make('promo_title')
                            ->label('Promo Title'),

                        SpatieMediaLibraryFileUpload::make('promo_image')
                            ->collection('promo_image')
                            ->image()
                            ->label('Promo Preview Image'),

                        SpatieMediaLibraryFileUpload::make('promo_video')
                            ->collection('promo_video')
                            ->acceptedFileTypes(['video/mp4'])
                            ->maxSize(102400) // 100MB
                            ->disk('public')
                            ->label('Promo Video File'),
                    ])
                    ->columns(2),

                /* ===============================
                 * DESCRIPTION
                 * =============================== */
                Section::make('Description')
                    ->schema([
                        TextInput::make('description_title')
                            ->label('Title'),

                        Textarea::make('description_content')
                            ->rows(5)
                            ->label('Content'),
                    ]),

                /* ===============================
                 * PROGRAM
                 * =============================== */
                Section::make('Program')
                    ->schema([
                        TextInput::make('program_title')
                            ->label('Program Title'),

                        Repeater::make('program')
                            ->schema([
                                TextInput::make('title')
                                    ->required(),

                                Textarea::make('content')
                                    ->rows(4)
                                    ->required(),
                            ])
                            ->reorderable()
                            ->collapsible(),
                    ]),

                /* ===============================
                 * AUTHOR
                 * =============================== */
                Section::make('Author')
                    ->schema([
                        TextInput::make('author_name'),

                        TextInput::make('author_subtitle'),

                        Textarea::make('author_bio_1')
                            ->rows(4),

                        Textarea::make('author_bio_2')
                            ->rows(4),

                        SpatieMediaLibraryFileUpload::make('author_image')
                            ->collection('author_image')
                            ->image(),
                    ])
                    ->columns(2),

                /* ===============================
                 * FAQ
                 * =============================== */
                Section::make('FAQ')
                    ->schema([
                        TextInput::make('faq_title'),

                        Repeater::make('faq')
                            ->schema([
                                TextInput::make('question')
                                    ->required(),

                                Textarea::make('answer')
                                    ->required()
                                    ->rows(4),
                            ])
                            ->reorderable()
                            ->collapsible(),
                    ]),

                /* ===============================
                 * PRICING
                 * =============================== */
                Section::make('Pricing')
                    ->schema([
                        TextInput::make('pricing_badge'),
                        TextInput::make('pricing_title'),
                        TextInput::make('pricing_old_price'),
                        TextInput::make('pricing_current_price'),
                        TextInput::make('pricing_button_text'),
                        TextInput::make('pricing_note'),

                        Repeater::make('pricing_features')
                            ->schema([
                                TextInput::make('feature')
                                    ->required(),
                            ])
                            ->reorderable()
                            ->collapsible(),
                    ])
                    ->columns(2),
            ]);
    }
}
