<?php

namespace App\Filament\Resources\Seos\Schemas;



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

                Section::make('Page Settings')
                    ->schema([
                        Select::make('page')
                            ->options([
                                'home' => 'Home',
                                'personal' => 'Personal',
                                'practice' => 'Practice',
                                'legal' => 'Legal',
                                'editoria' => 'Editoria',
                            ])
                            ->required()
                            ->unique(ignoreRecord: true),

                        TextInput::make('canonical')
                            ->label('Canonical URL')
                            ->url()
                            ->placeholder('https://example.com/about')
                            ->maxLength(255),
                    ])
                    ->columns(2),

                Section::make('SEO Meta Data')
                    ->schema([
                        TextInput::make('title')
                            ->label('Meta Title')
                            ->required()
                            ->maxLength(60)
                            ->helperText('Recommended: 50–60 characters'),

                        Textarea::make('description')
                            ->label('Meta Description')
                            ->rows(3)
                            ->maxLength(160)
                            ->helperText('Recommended: 140–160 characters')
                            ->columnSpanFull(),

                        TagsInput::make('keywords')
                            ->label('Meta Keywords')
                            ->placeholder('Add keywords')
                            ->columnSpanFull(),
                    ]),

                Section::make('Open Graph Image')
                    ->schema([
                        SpatieMediaLibraryFileUpload::make('seo_image') // ✔ ემთხვევა მოდელს
                        ->collection('seo_image')                   // ✔ იგივე collection
                        ->disk('public')
                            ->image()
                            ->imageEditor()
                            ->conversion('webp')
                            ->responsiveImages()
                            ->maxSize(2048)
                            ->helperText('Recommended size: 1200x630px')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
