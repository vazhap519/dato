<?php

namespace App\Filament\Resources\SiteSettings\Schemas;

use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;

class SiteSettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                Section::make('General Settings')
                    ->schema([

                        TextInput::make('site_name')
                            ->label('Site Name')
                            ->required()
                            ->maxLength(100),

                    ])
                    ->columns(2),

                Section::make('Branding & Icons')
                    ->schema([

                        SpatieMediaLibraryFileUpload::make('favicon')
                            ->collection('favicon')
                            ->image()
                            ->imageEditor()
                            ->disk('public')
                            ->maxSize(1024)
                            ->helperText('Recommended: 32x32 or 64x64 PNG')
                            ->columnSpanFull(),

                        SpatieMediaLibraryFileUpload::make('apple_icon')
                            ->collection('apple_icon')
                            ->image()
                            ->imageEditor()
                            ->disk('public')
                            ->maxSize(2048)
                            ->helperText('Recommended: 180x180 PNG')
                            ->columnSpanFull(),

                        SpatieMediaLibraryFileUpload::make('og_default')
                            ->collection('og_default')
                            ->image()
                            ->imageEditor()
                            ->conversion('webp')
                            ->responsiveImages()
                            ->disk('public')
                            ->helperText('Recommended: 1200x630 (Open Graph default image)')
                            ->columnSpanFull(),

                    ])
                    ->columns(1),

            ]);
    }
}
