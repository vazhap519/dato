<?php

namespace App\Filament\Resources\Legals\Schemas;

use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Repeater;

class LegalForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([

            Section::make('Заголовок страницы')
                ->schema([
                    TextInput::make('title')->label('Заголовок')->required(),
                    Textarea::make('subtitle')->label('Подзаголовок')->rows(3),
                    TextInput::make('download_button_text')->label('Текст кнопки скачивания'),
                ]),

            Section::make('Боковая навигация')
                ->schema([
                    Repeater::make('sections_nav')->label('Разделы боковой навигации')
                        ->schema([
                            TextInput::make('label')->label('Название')->required(),
                            TextInput::make('anchor')->label('Якорь раздела')->required(),
                        ])
                        ->reorderable()
                        ->collapsible(),
                ]),

            Section::make('Политика конфиденциальности')
                ->schema([
                    TextInput::make('privacy_title')->label('Заголовок политики конфиденциальности'),
                    Textarea::make('privacy_content')->label('Текст политики конфиденциальности')
                        ->rows(10)
                        ->columnSpanFull(),
                ]),

            Section::make('Пользовательское соглашение')
                ->schema([
                    TextInput::make('agreement_title')->label('Заголовок пользовательского соглашения'),
                    Textarea::make('agreement_content')->label('Текст пользовательского соглашения')
                        ->rows(10)
                        ->columnSpanFull(),
                ]),

            Section::make('Публичная оферта')
                ->schema([
                    TextInput::make('offer_title')->label('Заголовок публичной оферты'),
                    Textarea::make('offer_content')->label('Текст публичной оферты')
                        ->rows(10)
                        ->columnSpanFull(),
                ]),

            Section::make('Реквизиты организации')
                ->schema([
                    TextInput::make('details_title')->label('Заголовок реквизитов'),

                    Repeater::make('company_details')->label('Реквизиты организации')
                        ->schema([
                            TextInput::make('label')->label('Название')->required(),
                            TextInput::make('value')->label('Значение')->required(),
                        ])
                        ->reorderable()
                        ->collapsible(),
                ]),

            Section::make('Заключительный блок')
                ->schema([
                    TextInput::make('cta_title')->label('Заголовок заключительного блока'),
                    Textarea::make('cta_description')->label('Описание заключительного блока'),
                    TextInput::make('cta_button_text')->label('Текст заключительной кнопки'),
                ]),
        ]);
    }
}
