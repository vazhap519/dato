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
                Section::make('Первый экран')
                    ->schema([

                        TextInput::make('hero_badge')
                            ->label('Бейдж первого экрана'),

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
                Section::make('Блок с цитатой')
                    ->schema([
                        Textarea::make('quote_text')->rows(3),
                        TextInput::make('quote_button_text'),
                    ]),

                /*
                |--------------------------------------------------------------------------
                | INFO BLOCKS
                |--------------------------------------------------------------------------
                */
                Section::make('Информационные блоки')
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
                Section::make('Дни программы')
                    ->schema([
                        Repeater::make('program_days')
                            ->schema([
                                TextInput::make('day_label')->label('Название дня'),
                                TextInput::make('title')->required(),
                                Textarea::make('description')->rows(3),
                            ])
                            ->reorderable()
                            ->collapsible()
                            ->columnSpanFull(),
                        TextInput::make('program_button_text')
                            ->label('Текст кнопки программы'),
                    ]),

                /*
                |--------------------------------------------------------------------------
                | FOR WHOM
                |--------------------------------------------------------------------------
                */
                Section::make('Для кого')
                    ->schema([

                        TextInput::make('for_whom_title'),
                        Textarea::make('for_whom_description')->rows(3),

                        Repeater::make('for_whom_list')
                            ->schema([
                                TextInput::make('text')->required(),
                            ])
                            ->reorderable()
                            ->collapsible(),

                        TextInput::make('for_whom_button_text')
                            ->label('Текст дополнительной кнопки блока «Для кого»'),

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
                Section::make('Почему')
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
                Section::make('Об авторе')
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
                Section::make('Финальный призыв')
                    ->schema([
                        TextInput::make('cta_title'),
                        Textarea::make('cta_description')->rows(3),
                        TextInput::make('cta_button_text'),
                    ]),
            ]);
    }
}
