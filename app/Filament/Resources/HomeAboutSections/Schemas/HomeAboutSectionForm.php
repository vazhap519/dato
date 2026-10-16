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

            Section::make('Основное содержание')
                ->schema([

                    TextInput::make('kicker')
                        ->label('Надзаголовок')
                        ->maxLength(255)
                        ->required(),

                    TextInput::make('title')
                        ->label('Заголовок')
                        ->maxLength(255)
                        ->required(),

                    Textarea::make('paragraph_1')
                        ->label('Первый абзац')
                        ->rows(4)
                        ->required(),

                    Textarea::make('paragraph_2')
                        ->label('Второй абзац')
                        ->rows(4)
                        ->required(),

                ])
                ->columns(2),

            Section::make('Показатели')
                ->schema([

                    TextInput::make('stat_1_value')
                        ->label('Показатель 1 — значение')
                        ->maxLength(50)
                        ->required(),

                    TextInput::make('stat_1_label')
                        ->label('Показатель 1 — подпись')
                        ->maxLength(100)
                        ->required(),

                    TextInput::make('stat_2_value')
                        ->label('Показатель 2 — значение')
                        ->maxLength(50)
                        ->required(),

                    TextInput::make('stat_2_label')
                        ->label('Показатель 2 — подпись')
                        ->maxLength(100)
                        ->required(),

                    TextInput::make('stat_3_value')
                        ->label('Показатель 3 — значение')
                        ->maxLength(50)
                        ->required(),

                    TextInput::make('stat_3_label')
                        ->label('Показатель 3 — подпись')
                        ->maxLength(100)
                        ->required(),

                ])
                ->columns(2),

            Section::make('Изображение раздела «О нас»')
                ->schema([

                    SpatieMediaLibraryFileUpload::make('about_image')->label('Изображение раздела «О нас»')
                        ->collection('about_image')
                        ->disk('public')
                        ->image()
                        ->imageEditor()
                        ->conversion('webp')
                        ->responsiveImages()
                        ->required(),

                ])
                ->columns(1),

            Section::make('Статус')
                ->schema([

                    Toggle::make('is_active')
                        ->label('Активно')
                        ->default(true),

                ])
                ->columns(1),

        ]);
    }
}
