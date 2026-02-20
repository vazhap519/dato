<?php

namespace App\Filament\Resources;

use App\Models\ContactSection;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;

class ContactSectionResource extends Resource
{
    protected static ?string $model = ContactSection::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';

    public static function form(Form $form): Form
    {
        return $form->schema([

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


    // 🔥 Singleton — მხოლოდ 1 ჩანაწერი
    public static function canCreate(): bool
    {
        return ContactSection::count() === 0;
    }
}
