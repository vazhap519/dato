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

                Section::make('Общие настройки')
                    ->schema([

                        TextInput::make('site_name')
                            ->label('Название сайта')
                            ->required()
                            ->maxLength(100),

                    ])
                    ->columns(2),

                Section::make('Логотипы и иконки')
                    ->schema([

                        SpatieMediaLibraryFileUpload::make('favicon')->label('Иконка сайта (favicon)')
                            ->collection('favicon')
                            ->image()
                            ->imageEditor()
                            ->disk('public')
                            ->maxSize(1024)
                            ->helperText('Рекомендуемый размер: 32 × 32 или 64 × 64 пикселя, PNG')
                            ->columnSpanFull(),

                        SpatieMediaLibraryFileUpload::make('apple_icon')->label('Иконка для устройств Apple')
                            ->collection('apple_icon')
                            ->image()
                            ->imageEditor()
                            ->disk('public')
                            ->maxSize(2048)
                            ->helperText('Рекомендуемый размер: 180 × 180 пикселей, PNG')
                            ->columnSpanFull(),

                        SpatieMediaLibraryFileUpload::make('og_default')->label('Изображение Open Graph по умолчанию')
                            ->collection('og_default')
                            ->image()
                            ->imageEditor()
                            ->conversion('webp')
                            ->responsiveImages()
                            ->disk('public')
                            ->helperText('Рекомендуемый размер: 1200 × 630 пикселей (изображение Open Graph по умолчанию)')
                            ->columnSpanFull(),

                        SpatieMediaLibraryFileUpload::make('logo_default')->label('Основной логотип')
                            ->collection('logo_default')
                            ->image()
                            ->imageEditor()
                            ->conversion('webp')
                            ->responsiveImages()
                            ->disk('public')
                            ->columnSpanFull(),

                    ])
                    ->columns(1),

            ]);
    }
}
