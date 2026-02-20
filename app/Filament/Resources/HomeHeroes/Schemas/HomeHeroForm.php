<?php

namespace App\Filament\Resources\HomeHeroes\Schemas;

use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;

class HomeHeroForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Hero Content')
                ->schema([
                    TextInput::make('badge_text')->required(),

                    TextInput::make('title_line_1')->required(),

                    TextInput::make('title_highlight')->required(),

                    Textarea::make('subtitle')
                        ->rows(3)
                        ->required(),

                    TextInput::make('primary_button_text')->required(),
                    TextInput::make('primary_button_href'),

                    TextInput::make('secondary_button_text'),
                    TextInput::make('secondary_button_href'),

                    Toggle::make('is_active')->default(true),
                ])
                ->columns(2),

            Section::make('Hero Image')
                ->schema([
                    SpatieMediaLibraryFileUpload::make('hero_image')
                        ->collection('hero_image')
                        ->disk('public')
                        ->image()
                        ->imageEditor()
                        ->conversion('webp')
                        ->responsiveImages()
                        ->required(),
                ]),
        ]);
    }
}
