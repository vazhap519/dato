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
                            ->label('Заголовок первого экрана')
                            ->required(),

                        Textarea::make('hero_description')->label('Описание первого экрана')
                            ->rows(3),

                        TextInput::make('hero_button_text')->label('Текст кнопки первого экрана'),
                        TextInput::make('hero_button_url')->label('Ссылка кнопки первого экрана'),

                        SpatieMediaLibraryFileUpload::make('hero_image')->label('Изображение первого экрана')
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
                Section::make('Цитата')
                    ->schema([
                        Textarea::make('quote_text')->label('Текст цитаты')->rows(3),
                        TextInput::make('quote_button_text')->label('Текст кнопки под цитатой'),
                        TextInput::make('quote_button_url')
                            ->label('Ссылка кнопки под цитатой')
                            ->placeholder('https://example.com или /personal')
                            ->maxLength(2048),
                    ]),

                /*
                |--------------------------------------------------------------------------
                | INFO BLOCKS
                |--------------------------------------------------------------------------
                */
                Section::make('Информационные блоки')
                    ->schema([
                        Repeater::make('info_blocks')->label('Информационные блоки')
                            ->schema([
                                TextInput::make('title')->label('Заголовок')->required(),
                                TextInput::make('description')->label('Описание')->required(),
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
                        Repeater::make('program_days')->label('Дни программы')
                            ->schema([
                                TextInput::make('day_label')->label('Название дня'),
                                TextInput::make('title')->label('Заголовок')->required(),
                                Textarea::make('description')->label('Описание')->rows(3),
                            ])
                            ->reorderable()
                            ->collapsible()
                            ->columnSpanFull(),
                        TextInput::make('program_button_text')
                            ->label('Текст кнопки программы'),
                        TextInput::make('program_button_url')
                            ->label('Ссылка кнопки программы')
                            ->placeholder('https://example.com или /personal')
                            ->maxLength(2048),
                    ]),

                /*
                |--------------------------------------------------------------------------
                | FOR WHOM
                |--------------------------------------------------------------------------
                */
                Section::make('Для кого')
                    ->schema([

                        TextInput::make('for_whom_title')->label('Заголовок блока «Для кого»'),
                        Textarea::make('for_whom_description')->label('Описание блока «Для кого»')->rows(3),

                        Repeater::make('for_whom_list')->label('Пункты блока «Для кого»')
                            ->schema([
                                TextInput::make('text')->label('Текст')->required(),
                            ])
                            ->reorderable()
                            ->collapsible(),

                        TextInput::make('for_whom_button_text')
                            ->label('Текст кнопки блока «Для кого»'),
                        TextInput::make('for_whom_button_url')
                            ->label('Ссылка кнопки блока «Для кого»')
                            ->placeholder('https://example.com или /personal')
                            ->maxLength(2048),

                        SpatieMediaLibraryFileUpload::make('for_whom_image')->label('Изображение блока «Для кого»')
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
                        TextInput::make('why_title')->label('Заголовок блока «Почему»'),
                        Textarea::make('why_description')->label('Описание блока «Почему»')->rows(3),
                        TextInput::make('why_button_text')->label('Текст кнопки блока «Почему»'),
                        TextInput::make('why_button_url')
                            ->label('Ссылка кнопки блока «Почему»')
                            ->placeholder('https://example.com или /personal')
                            ->maxLength(2048),
                    ]),

                /*
                |--------------------------------------------------------------------------
                | AUTHOR SECTION
                |--------------------------------------------------------------------------
                */
                Section::make('Об авторе')
                    ->schema([

                        TextInput::make('author_name')->label('Имя автора'),
                        Textarea::make('author_quote')->label('Цитата автора')->rows(3),

                        Repeater::make('author_points')->label('Пункты об авторе')
                            ->schema([
                                TextInput::make('text')->label('Текст')->required(),
                            ])
                            ->reorderable()
                            ->collapsible(),

                        TextInput::make('author_button_text')->label('Текст кнопки об авторе'),
                        TextInput::make('author_button_url')
                            ->label('Ссылка кнопки об авторе')
                            ->placeholder('https://example.com или /personal')
                            ->maxLength(2048),

                        SpatieMediaLibraryFileUpload::make('author_image')->label('Фотография автора')
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
                Section::make('Заключительный блок')
                    ->schema([
                        TextInput::make('cta_title')->label('Заголовок заключительного блока'),
                        Textarea::make('cta_description')->label('Описание заключительного блока')->rows(3),
                        TextInput::make('cta_button_text')->label('Текст заключительной кнопки'),
                        TextInput::make('cta_button_url')
                            ->label('Ссылка кнопки заключительного блока')
                            ->placeholder('https://example.com или /personal')
                            ->maxLength(2048),
                    ]),
            ]);
    }
}
