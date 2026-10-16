<?php

namespace App\Filament\Resources\Seos\Schemas;



    use Filament\Forms\Components\Select;
    use Filament\Forms\Components\TextInput;
    use Filament\Forms\Components\Textarea;

    use Filament\Forms\Components\TagsInput;
    use Filament\Schemas\Components\Section;
    use Filament\Schemas\Schema;
    use Filament\Forms\Components\SpatieMediaLibraryFileUpload;

class SeoForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                Section::make('Настройки страницы')
                    ->schema([
                        Select::make('page')->label('Страница')
                            ->options([
                                'home' => 'Главная',
                                'personal' => 'Персональные услуги',
                                'practice' => 'Практики',
                                'legal' => 'Юридическая информация',
                                'editoria' => 'Редакционные материалы',
                            ])
                            ->required()
                            ->unique(ignoreRecord: true),

                        TextInput::make('canonical')
                            ->label('Канонический URL')
                            ->url()
                            ->placeholder('https://example.com/about')
                            ->maxLength(255),
                    ])
                    ->columns(2),

                Section::make('Метаданные SEO')
                    ->schema([
                        TextInput::make('title')
                            ->label('Мета-заголовок')
                            ->required()
                            ->maxLength(60)
                            ->helperText('Рекомендуемая длина: 50–60 символов'),

                        Textarea::make('description')
                            ->label('Текст отзыва')
                            ->rows(3)
                            ->maxLength(160)
                            ->helperText('Рекомендуемая длина: 140–160 символов')
                            ->columnSpanFull(),

                        TagsInput::make('keywords')
                            ->label('Ключевые слова')
                            ->placeholder('Добавьте ключевые слова')
                            ->columnSpanFull(),
                    ]),

                Section::make('Изображение для социальных сетей (Open Graph)')
                    ->schema([
                        SpatieMediaLibraryFileUpload::make('seo_image')->label('Изображение Open Graph') // ✔ ემთხვევა მოდელს
                        ->collection('seo_image')                   // ✔ იგივე collection
                        ->disk('public')
                            ->image()
                            ->imageEditor()
                            ->conversion('webp')
                            ->responsiveImages()
                            ->maxSize(2048)
                            ->helperText('Рекомендуемый размер: 1200 × 630 пикселей')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
