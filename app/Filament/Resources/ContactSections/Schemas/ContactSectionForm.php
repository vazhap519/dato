<?php

namespace App\Filament\Resources\ContactSections\Schemas;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ContactSectionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
             TextInput::make('title')->label('Заголовок')
                ->required(),

            Textarea::make('description')->label('Описание')
                ->rows(4),

            Repeater::make('questions')->label('Вопросы')
                ->schema([
                    TextInput::make('question')->label('Вопрос')->required(),
                ])
                ->columnSpanFull(),

            TextInput::make('button_text')->label('Текст кнопки'),

            TextInput::make('button_url')
                ->label('Ссылка кнопки'),

            SpatieMediaLibraryFileUpload::make('contact_image')->label('Изображение блока контактов')
                ->collection('contact_image')
                ->image()
                ->imageEditor()
                ->conversion('webp')
                ->responsiveImages(),

        ]);

    }
}
