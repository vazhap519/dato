<?php

namespace App\Filament\Resources\Footers\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class FooterForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make( 'brand_name'),
 TextInput::make('description'),
 TextInput::make('nav_title'),
 TextInput::make('support_title'),
 TextInput::make('support_faq'),
 TextInput::make('support_payment'),
 TextInput::make('support_privacy'),
 TextInput::make('support_offer'),
 TextInput::make('Contact_title'),
 TextInput::make('email'),
 TextInput::make('location'),
 TextInput::make('copyright'),
 TextInput::make('youtube'),
 TextInput::make('telegram'),
 TextInput::make('tiktok'),
            ]);
    }
}
