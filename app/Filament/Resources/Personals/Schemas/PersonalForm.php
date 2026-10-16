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
                Section::make('Первый экран')
                    ->schema([

                        Grid::make(2)->schema([
                            TextInput::make('hero_badge')->label('Бейдж первого экрана'),

                            TextInput::make('hero_author_name')->label('Имя автора на первом экране'),
                        ]),

                        Grid::make(3)->schema([
                            TextInput::make('hero_title_line_1')->label('Первая строка заголовка'),
                            TextInput::make('hero_title_highlight')->label('Выделенная часть заголовка'),
                            TextInput::make('hero_title_line_2')->label('Вторая строка заголовка'),
                        ]),

                        Textarea::make('hero_description')->label('Описание первого экрана')
                            ->rows(4)
                            ->columnSpanFull(),

                        Grid::make(2)->schema([
                            TextInput::make('hero_primary_button_text')->label('Текст основной кнопки'),
                            TextInput::make('hero_primary_button_url')->label('Ссылка основной кнопки')->url(),
                        ]),

                        Grid::make(2)->schema([
                            TextInput::make('hero_secondary_button_text')->label('Текст дополнительной кнопки'),
                            TextInput::make('hero_secondary_button_url')->label('Ссылка дополнительной кнопки')->url(),
                        ]),

                        TextInput::make('hero_author_role')->label('Роль автора'),

                        SpatieMediaLibraryFileUpload::make('hero_image')->label('Изображение первого экрана')
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
                Section::make('Как это работает')
                    ->schema([

                        Grid::make(2)->schema([
                            TextInput::make('how_title_line_1')->label('Заголовок блока «Как это работает»'),
                            TextInput::make('how_title_highlight')->label('Выделенная часть заголовка'),
                        ]),

                        Textarea::make('how_description')->label('Описание блока «Как это работает»')
                            ->rows(4)
                            ->columnSpanFull(),

                        Repeater::make('how_items')->label('Элементы блока «Как это работает»')
                            ->schema([
                                TextInput::make('title')->label('Заголовок')->required(),
                                Textarea::make('description')->label('Описание')->rows(3),
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
                Section::make('Этапы')
                    ->schema([

                        TextInput::make('steps_title')->label('Заголовок этапов'),
                        TextInput::make('steps_subtitle')->label('Подзаголовок этапов'),

                        Repeater::make('steps_items')->label('Этапы')
                            ->schema([
                                TextInput::make('title')->label('Заголовок')->required(),
                                Textarea::make('description')->label('Описание')->rows(3),
                            ])
                            ->reorderable()
                            ->collapsible()
                            ->columnSpanFull(),

                        SpatieMediaLibraryFileUpload::make('steps_images')->label('Изображения этапов')
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
                Section::make('Стоимость')
                    ->schema([

                        TextInput::make('pricing_title')->label('Заголовок блока стоимости'),

                        Grid::make(2)->schema([
                            TextInput::make('pricing_amount')->label('Стоимость'),
                            TextInput::make('pricing_currency')->label('Валюта'),
                        ]),

                        Repeater::make('pricing_features')->label('Что входит в стоимость')
                            ->schema([
                                TextInput::make('feature')->label('Преимущество')->required(),
                            ])
                            ->reorderable()
                            ->collapsible()
                            ->columnSpanFull(),

                        Grid::make(2)->schema([
                            TextInput::make('pricing_button_text')->label('Текст кнопки оплаты'),
                            TextInput::make('pricing_button_url')->label('Ссылка кнопки оплаты')->url(),
                        ]),
                    ]),

                /*
                |--------------------------------------------------------------------------
                | FAQ SECTION
                |--------------------------------------------------------------------------
                */
                Section::make('Вопросы и ответы')
                    ->schema([

                        TextInput::make('faq_title')->label('Заголовок вопросов и ответов'),

                        Repeater::make('faq_items')->label('Вопросы и ответы')
                            ->schema([
                                TextInput::make('question')->label('Вопрос')->required(),
                                Textarea::make('answer')->label('Ответ')->rows(4)->required(),
                            ])
                            ->reorderable()
                            ->collapsible()
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
