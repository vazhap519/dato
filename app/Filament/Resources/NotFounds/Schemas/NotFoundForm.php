<?php

namespace App\Filament\Resources\NotFounds\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class NotFoundForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
               TextInput::make('not_found_title')->label('Заголовок страницы 404')
                ->required()
                ->maxLength(255),
                TextInput::make('not_found_button_text')->label('Текст кнопки возврата')
                    ->required()
                    ->maxLength(255),
                TextArea::make('not_found_content')->label('Текст страницы 404')
                ->required()

            ]);
    }
}
