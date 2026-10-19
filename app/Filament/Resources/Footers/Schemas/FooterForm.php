<?php

namespace App\Filament\Resources\Footers\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class FooterForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Призыв к действию над подвалом')->schema([
                    Toggle::make('cta_enabled')->label('Показывать блок')->default(true),
                    TextInput::make('cta_badge')->label('Надзаголовок'),
                    TextInput::make('cta_title')->label('Заголовок'),
                    Textarea::make('cta_description')->label('Описание')->rows(3),
                    TextInput::make('cta_button_text')->label('Текст кнопки'),
                    TextInput::make('cta_button_url')->label('Ссылка кнопки')->placeholder('/editoria'),
                ])->columns(2),
                TextInput::make( 'brand_name'),
 TextInput::make('description')->label('Описание'),
 TextInput::make('nav_title')->label('Заголовок навигации'),
 TextInput::make('support_title')->label('Заголовок раздела помощи'),
 TextInput::make('support_faq')->label('Ссылка на вопросы и ответы'),
 TextInput::make('support_payment')->label('Ссылка на оплату'),
 TextInput::make('support_privacy')->label('Ссылка на политику конфиденциальности'),
 TextInput::make('support_offer')->label('Ссылка на оферту'),
 TextInput::make('Contact_title')->label('Заголовок контактов'),
 TextInput::make('email')->label('Электронная почта'),
 TextInput::make('location')->label('Местоположение'),
 TextInput::make('copyright')->label('Текст об авторских правах'),
 TextInput::make('youtube')->label('Ссылка на YouTube'),
 TextInput::make('telegram')->label('Ссылка на Telegram'),
 TextInput::make('tiktok')->label('Ссылка на TikTok'),
            ]);
    }
}
