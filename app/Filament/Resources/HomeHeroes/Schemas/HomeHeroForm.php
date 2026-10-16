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
            Section::make('Содержание первого экрана')
                ->schema([
                    TextInput::make('badge_text')->label('Текст бейджа')->required(),

                    TextInput::make('title_line_1')->label('Первая строка заголовка')->required(),

                    TextInput::make('title_highlight')->label('Выделенная часть заголовка')->required(),

                    Textarea::make('subtitle')->label('Подзаголовок')
                        ->rows(3)
                        ->required(),

                    TextInput::make('primary_button_text')->label('Текст основной кнопки')->required(),
                    TextInput::make('primary_button_href')->label('Ссылка основной кнопки'),

                    TextInput::make('secondary_button_text')->label('Текст дополнительной кнопки'),
                    TextInput::make('secondary_button_href')->label('Ссылка дополнительной кнопки'),

                    Toggle::make('is_active')->label('Активно')->default(true),
                ])
                ->columns(2),

            Section::make('Изображение первого экрана')
                ->schema([
                    SpatieMediaLibraryFileUpload::make('hero_image')->label('Изображение первого экрана')
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
