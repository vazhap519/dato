<?php

namespace App\Filament\Resources\HomeAboutSections\Schemas;

use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;

use Filament\Forms\Components\SpatieMediaLibraryFileUpload;

class HomeAboutSectionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([

            Section::make('Content')
                ->schema([

                    TextInput::make('kicker')
                        ->label('Kicker (small title)')
                        ->maxLength(255)
                        ->required(),

                    TextInput::make('title')
                        ->label('Main Title')
                        ->maxLength(255)
                        ->required(),

                    Textarea::make('paragraph_1')
                        ->label('Paragraph 1')
                        ->rows(4)
                        ->required(),

                    Textarea::make('paragraph_2')
                        ->label('Paragraph 2')
                        ->rows(4)
                        ->required(),

                ])
                ->columns(2),

            Section::make('Stats')
                ->schema([

                    TextInput::make('stat_1_value')
                        ->label('Stat #1 Value')
                        ->maxLength(50)
                        ->required(),

                    TextInput::make('stat_1_label')
                        ->label('Stat #1 Label')
                        ->maxLength(100)
                        ->required(),

                    TextInput::make('stat_2_value')
                        ->label('Stat #2 Value')
                        ->maxLength(50)
                        ->required(),

                    TextInput::make('stat_2_label')
                        ->label('Stat #2 Label')
                        ->maxLength(100)
                        ->required(),

                    TextInput::make('stat_3_value')
                        ->label('Stat #3 Value')
                        ->maxLength(50)
                        ->required(),

                    TextInput::make('stat_3_label')
                        ->label('Stat #3 Label')
                        ->maxLength(100)
                        ->required(),

                ])
                ->columns(2),

            Section::make('About Image')
                ->schema([

                    SpatieMediaLibraryFileUpload::make('about_image')
                        ->collection('about_image')
                        ->disk('public')
                        ->image()
                        ->imageEditor()
                        ->conversion('webp')
                        ->responsiveImages()
                        ->required(),

                ])
                ->columns(1),

            Section::make('Status')
                ->schema([

                    Toggle::make('is_active')
                        ->label('Active')
                        ->default(true),

                ])
                ->columns(1),

        ]);
    }
}
