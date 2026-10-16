<?php

namespace App\Filament\Resources\LandingPages\Schemas;

use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use App\Support\FrontendRoutes;
class LandingPageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([

            Section::make('Страница сайта')
                ->schema([

                   Select::make('key')
    ->label('Идентификатор страницы')
    ->required()
    ->options(FrontendRoutes::get())
    ->searchable()
    ->unique(ignoreRecord: true),

                ]),

            Section::make('Навигация по разделам')
                ->schema([

                    Repeater::make('navigationItems')->label('Ссылки навигации')
                        ->relationship('navigationItems')
                        ->orderColumn('sort')
                        ->reorderable()
                        ->schema([

                            TextInput::make('label')
                                ->label('Название ссылки')
                                ->required(),

                            TextInput::make('href')
                                ->label('Ссылка-якорь')
                                ->helperText('Например: products, about, reviews (без символа #)')
                                ->required()
                                ->dehydrateStateUsing(fn ($state) => ltrim(trim($state), '#')),

                            Toggle::make('is_active')->label('Активно')
                                ->default(true),

                        ])
                        ->columns(2),

                ]),

        ]);
    }
}
