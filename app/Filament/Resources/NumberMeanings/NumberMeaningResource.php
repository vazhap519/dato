<?php
namespace App\Filament\Resources\NumberMeanings;
use App\Models\NumberMeaning;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Pages\CreateRecord;
use Filament\Resources\Pages\EditRecord;
class NumberMeaningResource extends Resource {
    protected static ?string $model = NumberMeaning::class;
    protected static ?string $navigationLabel = 'Язык чисел';
    protected static ?string $modelLabel = 'значение числа';
    protected static ?string $pluralModelLabel = 'значения чисел';
    protected static string | \UnitEnum | null $navigationGroup = 'Самопознание';
    protected static ?int $navigationSort = 21;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-sparkles';
    public static function form(Schema $schema): Schema {
        return $schema->components([
            Section::make('Число и смысл')->schema([
                TextInput::make('number')->label('Число (только цифры)')->required()->regex('/^[0-9]{1,12}$/')->unique(ignoreRecord:true)->maxLength(12),
                TextInput::make('title')->label('Название')->required()->maxLength(255),
                Textarea::make('symbolism')->label('Символическое значение')->required()->rows(5)->columnSpanFull(),
                Textarea::make('light_side')->label('Светлая сторона')->rows(3),
                Textarea::make('shadow_side')->label('Теневая сторона')->rows(3),
                Textarea::make('reflection_question')->label('Вопрос к себе')->rows(2),
                Textarea::make('practice')->label('Практика')->rows(3),
                Toggle::make('is_published')->label('Опубликовано')->default(true),
            ])->columns(2),
        ]);
    }
    public static function table(Table $table): Table {
        return $table->columns([
            TextColumn::make('number')->label('Число')->searchable()->sortable(),
            TextColumn::make('title')->label('Название')->searchable(),
            IconColumn::make('is_published')->label('Опубликовано')->boolean(),
        ])->recordActions([EditAction::make(),DeleteAction::make()])
          ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
    public static function getPages(): array {
        return [
            'index' => Pages\ListNumberMeanings::route('/'),
            'create' => Pages\CreateNumberMeaning::route('/create'),
            'edit' => Pages\EditNumberMeaning::route('/{record}/edit'),
        ];
    }
}
