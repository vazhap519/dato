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

            Section::make('Header')
                ->schema([
                    TextInput::make('title')->required(),
                    Textarea::make('subtitle')->rows(3),
                    TextInput::make('download_button_text'),
                ]),

            Section::make('Sidebar Navigation')
                ->schema([
                    Repeater::make('sections_nav')
                        ->schema([
                            TextInput::make('label')->required(),
                            TextInput::make('anchor')->required(),
                        ])
                        ->reorderable()
                        ->collapsible(),
                ]),

            Section::make('Privacy Policy')
                ->schema([
                    TextInput::make('privacy_title'),
                    Textarea::make('privacy_content')
                        ->rows(10)
                        ->columnSpanFull(),
                ]),

            Section::make('User Agreement')
                ->schema([
                    TextInput::make('agreement_title'),
                    Textarea::make('agreement_content')
                        ->rows(10)
                        ->columnSpanFull(),
                ]),

            Section::make('Public Offer')
                ->schema([
                    TextInput::make('offer_title'),
                    Textarea::make('offer_content')
                        ->rows(10)
                        ->columnSpanFull(),
                ]),

            Section::make('Company Details')
                ->schema([
                    TextInput::make('details_title'),

                    Repeater::make('company_details')
                        ->schema([
                            TextInput::make('label')->required(),
                            TextInput::make('value')->required(),
                        ])
                        ->reorderable()
                        ->collapsible(),
                ]),

            Section::make('CTA Block')
                ->schema([
                    TextInput::make('cta_title'),
                    Textarea::make('cta_description'),
                    TextInput::make('cta_button_text'),
                ]),
        ]);
    }
}
