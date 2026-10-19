<?php

namespace App\Filament\Resources\Practises\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Hidden;
use App\Models\ClosedGroup;
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


                \Filament\Schemas\Components\Section::make('Бесплатный практикум на главной')
                    ->schema([
                        Toggle::make('free_enabled')->label('Показывать карточку')->default(true),
                        TextInput::make('free_title')->label('Название'),
                        Textarea::make('free_description')->label('Описание'),
                        TextInput::make('free_button_text')->label('Текст кнопки'),
                        TextInput::make('free_button_url')->label('Ссылка кнопки')->placeholder('/editoria'),
                        SpatieMediaLibraryFileUpload::make('free_image')->label('Изображение')->collection('free_image')->disk('public')->image(),
                    ])->columns(2),
                \Filament\Schemas\Components\Section::make('Блок «Начни с трёх дней для себя»')
                    ->schema([
                        Toggle::make('start_enabled')->label('Показывать блок')->default(true),
                        TextInput::make('start_badge')->label('Надзаголовок'),
                        TextInput::make('start_title')->label('Заголовок'),
                        Textarea::make('start_description')->label('Описание'),
                        Repeater::make('start_steps')->label('Шаги')->schema([TextInput::make('text')->label('Название')->required()])->reorderable()->collapsible(),
                        TextInput::make('start_note')->label('Подпись'),
                        TextInput::make('start_button_text')->label('Текст кнопки'),
                        TextInput::make('start_button_url')->label('Ссылка кнопки')->placeholder('/editoria'),
                    ])->columns(2),
                Repeater::make('contents')->label('Практики')
                    ->relationship()
                    ->schema([

                        Hidden::make('product_type')->default('closed_group'),
                        Hidden::make('closed_group_id'),

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

                        // One selector for existing closed groups and personal consultation.
                        Select::make('product_selection')
                            ->label('Связанный продукт')
                            ->options(fn () => ['personal' => 'Личная консультация'] +
                                ClosedGroup::query()->orderBy('hero_title')->get()
                                    ->mapWithKeys(fn ($group) => [
                                        'group_' . $group->id => $group->hero_title ?: 'Закрытая группа #' . $group->id,
                                    ])->all())
                            ->searchable()
                            ->required()
                            ->live()
                            ->dehydrated(false)
                            ->afterStateHydrated(function ($component, $get) {
                                $component->state(
                                    $get('product_type') === 'personal'
                                        ? 'personal'
                                        : ($get('closed_group_id') ? 'group_' . $get('closed_group_id') : null)
                                );
                            })
                            ->afterStateUpdated(function ($state, $set) {
                                if ($state === 'personal') {
                                    $set('product_type', 'personal');
                                    $set('closed_group_id', null);
                                } else {
                                    $set('product_type', 'closed_group');
                                    $set('closed_group_id', str_starts_with((string) $state, 'group_')
                                        ? (int) substr($state, 6)
                                        : null);
                                }
                            }),

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
