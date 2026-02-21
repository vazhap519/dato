<?php

namespace App\Filament\Resources\Practises\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
class PractiseForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

               TextInput::make('header_big'),
TextInput::make('header_small'),
Repeater::make('content')
                    ->schema([
                        TextInput::make('title')
                            ->required(),
                            Textarea::make('description')
                            ->required(),
                        TextInput::make('price'),

                        TextInput::make('telegram_url'),

                        SpatieMediaLibraryFileUpload::make('practise_image')
                            ->collection('practise_image')
                            ->image()
                            ->imageEditor()
                            ->conversion('webp')
                            ->responsiveImages(),

        Toggle::make('is_active')
            ->label('Active')
            ->default(true),

                    ])
                    ->columns(2)
                    ->reorderable()
                    ->collapsible()
                    ->columnSpanFull(),

            ]);
    }
}