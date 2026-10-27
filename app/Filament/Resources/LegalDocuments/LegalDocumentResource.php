<?php

namespace App\Filament\Resources\LegalDocuments;

use App\Filament\Resources\LegalDocuments\Pages\ListLegalDocuments;
use App\Filament\Resources\LegalDocuments\Pages\EditLegalDocument;
use App\Models\LegalDocument;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use Filament\Support\Icons\Heroicon;

class LegalDocumentResource extends Resource
{
    protected static string | \UnitEnum | null $navigationGroup = 'Юридический раздел';
    protected static ?int $navigationSort = 10;

    protected static ?string $model = LegalDocument::class;
    protected static ?string $navigationLabel = 'Юридические документы';
    protected static ?string $pluralModelLabel = 'Юридические документы';
    protected static ?string $modelLabel = 'Юридический документ';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('slug')->label('Адрес')->disabled()->dehydrated(false),
            TextInput::make('title')->label('Название')->required()->maxLength(255),
            TextInput::make('version')->label('Номер редакции')->required()->maxLength(30),
            DatePicker::make('effective_at')->label('Дата вступления в силу'),
            Textarea::make('content')->label('Текст документа')->rows(22)->columnSpanFull()
                ->helperText('Редактируйте текст и нумерацию разделов. Старый HTML выводится безопасно как текст. Перед публикацией проверьте юридическую редакцию.'),
            Toggle::make('is_published')->label('Опубликован')
                ->helperText('Не включайте для оферты до проверки тарифов, возвратов и данных исполнителя.'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('title')->label('Документ'),
            TextColumn::make('slug')->label('Адрес')->formatStateUsing(fn ($state) => '/'.$state),
            TextColumn::make('version')->label('Редакция'),
            IconColumn::make('is_published')->label('Опубликован')->boolean(),
            TextColumn::make('updated_at')->label('Обновлён')->dateTime('d.m.Y H:i'),
        ])->recordActions([EditAction::make()])->defaultSort('id');
    }

    public static function getPages(): array
    {
        return ['index' => ListLegalDocuments::route('/'), 'edit' => EditLegalDocument::route('/{record}/edit')];
    }
}
