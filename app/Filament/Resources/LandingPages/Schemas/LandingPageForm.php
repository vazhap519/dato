<?php

namespace App\Filament\Resources\LandingPages\Schemas;

use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;

class LandingPageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([

            Section::make('Landing Page')
                ->schema([

                    Select::make('key')
                        ->label('Select Page')
                        ->required()
                        ->options([
                            'home' => 'Home',
                            'personal' => 'Personal',
                            'practice' => 'Practice',
                            'legal' => 'Legal',
                            'editoria'  => 'Editoria',
                        ])
                        ->unique(ignoreRecord: true),

                ]),

            Section::make('Navigation (Scroll links)')
                ->schema([

                    Repeater::make('navigationItems')
                        ->relationship('navigationItems')
                        ->orderColumn('sort')
                        ->reorderable()
                        ->schema([

                            TextInput::make('label')
                                ->label('Link Label')
                                ->required(),

                            TextInput::make('href')
                                ->label('Anchor Link')
                                ->helperText('Example: products, about, reviews')
                                ->required()
                                ->dehydrateStateUsing(fn ($state) => ltrim(trim($state), '#')),

                            Toggle::make('is_active')
                                ->default(true),

                        ])
                        ->columns(2),

                ]),

        ]);
    }
}
