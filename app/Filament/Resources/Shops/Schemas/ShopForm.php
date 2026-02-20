<?php

namespace App\Filament\Resources\Shops\Schemas;

use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Repeater;

class ShopForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([

            Section::make('Shop Section')
                ->schema([
                    TextInput::make('subtitle')
                        ->label('Subtitle')
                        ->maxLength(255),

                    TextInput::make('title')
                        ->label('Title')
                        ->maxLength(255),

                    Toggle::make('is_active')
                        ->default(true),
                ])
                ->columns(2),
            Section::make('Products')
                ->schema([
                    Repeater::make('products')
                        ->relationship('products')
                        ->orderColumn('sort')
                        ->reorderable()
                        ->schema([

                            SpatieMediaLibraryFileUpload::make('product_image')
                                ->label('Product Image')
                                ->collection('product_image')
                                ->disk('public')
                                ->image()
                                ->imageEditor()
                                ->conversion('webp')
                                ->responsiveImages()
                                ->required()
                                ->columnSpanFull(),

                            TextInput::make('badge')
                                ->label('Badge')
                                ->maxLength(255),

                            TextInput::make('title')
                                ->label('Product Title')
                                ->maxLength(255)
                                ->required(),

                            Textarea::make('description')
                                ->rows(4)
                                ->required()
                                ->columnSpanFull(),

                            TextInput::make('button_text')
                                ->label('Button Text')
                                ->maxLength(255),

                            TextInput::make('button_url')
                                ->label('Button URL')
                                ->maxLength(255),

                            Toggle::make('is_active')
                                ->label('Active')
                                ->default(true),

                        ])
                        ->columns(2),
                ])


        ]);
    }
}
