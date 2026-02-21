<?php

namespace App\Filament\Resources\ContactSections\Schemas;

use Filament\Schemas\Schema;

class ContactSectionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
             TextInput::make('title')
                ->required(),

            Textarea::make('description')
                ->rows(4),

            Repeater::make('questions')
                ->schema([
                    TextInput::make('question')->required(),
                ])
                ->columnSpanFull(),

            TextInput::make('button_text'),

            TextInput::make('button_url')
                ->label('Button Link'),

            SpatieMediaLibraryFileUpload::make('contact_image')
                ->collection('contact_image')
                ->image()
                ->imageEditor()
                ->conversion('webp')
                ->responsiveImages(),

        ]);
            
    }
}
