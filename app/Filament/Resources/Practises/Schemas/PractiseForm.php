<?php

namespace App\Filament\Resources\Practises\Schemas;

use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Illuminate\Support\Str;

class PractiseForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                TextInput::make('header_big')->label('Основной заголовок'),

                TextInput::make('header_small')->label('Подзаголовок'),

                Repeater::make('contents')->label('Практики')
                    ->relationship()
                    ->schema([

                        Select::make('product_type')
                            ->label('Тип продукта')
                            ->options([
                                'closed_group' => 'Закрытая группа',
                                'personal' => 'Личная консультация (/personal)',
                            ])
                            ->default('closed_group')
                            ->required()
                            ->live(),

                        // TITLE
                        TextInput::make('title')->label('Заголовок')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(function ($state, callable $set) {
                                $set('slug', Str::slug($state));
                            }),

                        // SLUG
                        TextInput::make('slug')->label('Часть адреса страницы')
                            ->required()
                            ->disabled()
                            ->dehydrated() ->reactive(),

                        // ✅ აქ გადავიტანეთ
                        Select::make('closed_group_id')->label('Связанная закрытая группа')
                            ->relationship('closedGroup', 'hero_title')
                            ->searchable()
                            ->preload()
                            ->required(fn ($get) => ($get('product_type') ?? 'closed_group') === 'closed_group')
                            ->visible(fn ($get) => ($get('product_type') ?? 'closed_group') === 'closed_group'),

                        Textarea::make('description')->label('Описание')->required(),

                        TextInput::make('price')->label('Цена'),

                        SpatieMediaLibraryFileUpload::make('practice_images')->label('Изображения практики') // ⚠️ აქ არის შეცდომა შენთან
                        ->collection('practice_images')
                            ->image()
                            ->imageEditor()
                            ->conversion('webp')
                            ->responsiveImages()
                            ->disk('public') // აუცილებელია
                            ->visibility('public'),


                        Toggle::make('is_active')->label('Активно')
                            ->default(true),
                    ])
                    ->columns(2)
                    ->reorderable()
                    ->collapsible()
                    ->columnSpanFull(),
            ]);
    }
}
