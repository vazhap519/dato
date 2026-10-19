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
                Section::make('Первый экран')
                    ->schema([
                        TextInput::make('hero_badge')
                            ->label('Бейдж первого экрана'),

                        TextInput::make('hero_title')
                            ->label('Заголовок первого экрана')
                            ->live(onBlur: true)
                            ->afterStateUpdated(function ($state, callable $set) {
                                $set('slug', Str::slug($state));
                            }),

                        TextInput::make('slug')->label('Часть адреса страницы')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->disabled()
                            ->dehydrated()->reactive(),

                        TextInput::make('hero_title_highlight')
                            ->label('Выделенная часть заголовка'),

                        Textarea::make('hero_description')
                            ->label('Описание первого экрана')
                            ->rows(4),

                        TextInput::make('hero_button_primary')
                            ->label('Текст основной кнопки'),

                        TextInput::make('hero_button_secondary')
                            ->label('Текст дополнительной кнопки'),

                        SpatieMediaLibraryFileUpload::make('hero_image')->collection('hero_image')
                            ->image()
                            ->label('Изображение первого экрана'),
                    ])
                    ->columns(2),

                /* ===============================
                 * CONDITIONS
                 * =============================== */
                Section::make('Условия')
                    ->schema([
                        Repeater::make('conditions')->label('Условия')
                            ->schema([
                                TextInput::make('label')->label('Название')
                                    ->required(),

                                TextInput::make('value')->label('Значение')
                                    ->required(),
                            ])
                            ->defaultItems(3)
                            ->reorderable()
                            ->collapsible(),
                    ]),

                /* ===============================
                 * PROMO VIDEO
                 * =============================== */
                Section::make('Промовидео')
                    ->schema([
                        TextInput::make('promo_title')
                            ->label('Заголовок промовидео'),

                        SpatieMediaLibraryFileUpload::make('promo_image')->collection('promo_image')
                            ->image()
                            ->label('Обложка промовидео'),

                        SpatieMediaLibraryFileUpload::make('promo_video')->collection('promo_video')
                            ->acceptedFileTypes(['video/mp4'])
                            ->maxSize(102400) // 100MB
                            ->disk('public')
                            ->label('Видеофайл'),
                    ])
                    ->columns(2),

                /* ===============================
                 * DESCRIPTION
                 * =============================== */
                Section::make('Описание')
                    ->schema([
                        TextInput::make('description_title')
                            ->label('Заголовок описания'),

                        Textarea::make('description_content')->rows(5)
                            ->label('Текст описания'),
                    ]),

                /* ===============================
                 * PROGRAM
                 * =============================== */
                Section::make('Программа')
                    ->schema([
                        TextInput::make('program_title')
                            ->label('Заголовок программы'),

                        Repeater::make('program')->label('Программа')
                            ->schema([
                                TextInput::make('title')->label('Заголовок')
                                    ->required(),

                                Textarea::make('content')->label('Содержание')
                                    ->rows(4)
                                    ->required(),
                            ])
                            ->reorderable()
                            ->collapsible(),
                    ]),

                /* ===============================
                 * AUTHOR
                 * =============================== */
                Section::make('Автор')
                    ->schema([
                        TextInput::make('author_name')->label('Имя автора'),

                        TextInput::make('author_subtitle')->label('Подзаголовок об авторе'),

                        Textarea::make('author_bio_1')->label('Биография автора — абзац 1')
                            ->rows(4),

                        Textarea::make('author_bio_2')->label('Биография автора — абзац 2')
                            ->rows(4),

                        SpatieMediaLibraryFileUpload::make('author_image')->label('Фотография автора')
                            ->collection('author_image')
                            ->image(),
                    ])
                    ->columns(2),

                /* ===============================
                 * FAQ
                 * =============================== */
                Section::make('Частые вопросы')
                    ->schema([
                        TextInput::make('faq_title')->label('Заголовок раздела вопросов'),

                        Repeater::make('faq')->label('Вопросы и ответы')
                            ->schema([
                                TextInput::make('question')->label('Вопрос')
                                    ->required(),

                                Textarea::make('answer')->label('Ответ')
                                    ->required()
                                    ->rows(4),
                            ])
                            ->reorderable()
                            ->collapsible(),
                    ]),

                /* ===============================
                 * PRICING
                 * =============================== */
                Section::make('Стоимость')
                    ->schema([
                        TextInput::make('pricing_badge')->label('Бейдж блока стоимости'),
                        TextInput::make('pricing_title')->label('Заголовок блока стоимости'),
                        TextInput::make('pricing_old_price')->label('Прежняя стоимость'),
                        TextInput::make('pricing_current_price')->label('Текущая стоимость'),
                        TextInput::make('pricing_button_text')->label('Текст кнопки оплаты'),
                        TextInput::make('pricing_button_url')->label('Ссылка кнопки оплаты')->placeholder('https://...'),
                        TextInput::make('pricing_note')->label('Примечание о стоимости'),

                        Repeater::make('pricing_features')->label('Преимущества предложения')
                            ->schema([
                                TextInput::make('feature')->label('Преимущество')
                                    ->required(),
                            ])
                            ->reorderable()
                            ->collapsible(),
                    ])
                    ->columns(2),
            ]);
    }
}
