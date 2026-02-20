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
               TextInput::make('not_found_title')
                ->required()
                ->maxLength(255),
                TextInput::make('not_found_button_text')
                    ->required()
                    ->maxLength(255),
                TextArea::make('not_found_content')
                ->required()

            ]);
    }
}
