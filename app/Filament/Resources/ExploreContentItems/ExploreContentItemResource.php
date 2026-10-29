<?php

namespace App\Filament\Resources\ExploreContentItems;

use App\Filament\Resources\ExploreContentItems\Pages\EditExploreContentItem;
use App\Filament\Resources\ExploreContentItems\Pages\ListExploreContentItems;
use App\Models\ExploreContentItem;
use BackedEnum;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Actions\EditAction;
use Filament\Support\Icons\Heroicon;

class ExploreContentItemResource extends Resource
{
    protected static ?string $model = ExploreContentItem::class;
    protected static ?string $navigationLabel = 'Содержание инструментов';
    protected static ?string $modelLabel = 'элемент содержания';
    protected static ?string $pluralModelLabel = 'элементы содержания';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPencilSquare;
    protected static string|\UnitEnum|null $navigationGroup = 'Самопознание';
    protected static ?int $navigationSort = 30;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Элемент')->schema([
                TextInput::make('page_slug')->label('Раздел')->disabled(),
                TextInput::make('group_key')->label('Группа')->disabled(),
                TextInput::make('entry_key')->label('Ключ')->disabled(),
                TextInput::make('title')->label('Название в админке')->required(),
            ])->columns(2),
            Section::make('Все поля элемента')->schema(fn (?ExploreContentItem $record): array =>
                $record ? self::buildFields($record->payload ?? [], 'payload') : []
            ),
        ]);
    }

    public static function buildFields(array $data, string $prefix): array
    {
        $fields = [];
        foreach ($data as $key => $value) {
            $path = $prefix === '' ? (string) $key : $prefix . '.' . $key;
            $label = (string) $key;
            if (is_array($value)) {
                if (array_is_list($value)) {
                    if ($value === [] || count(array_filter($value, 'is_array')) === 0) {
                        $fields[] = TagsInput::make($path)->label($label)->helperText('Каждый элемент списка редактируется отдельно.');
                    } else {
                        $sample = collect($value)->first(fn ($row) => is_array($row)) ?? [];
                        $fields[] = Repeater::make($path)->label($label)
                            ->schema(self::buildFields($sample, ''))
                            ->defaultItems(0)->reorderable()->collapsible();
                    }
                } else {
                    $fields[] = Section::make($label)->schema(self::buildFields($value, $path))->collapsible();
                }
            } elseif (is_bool($value)) {
                $fields[] = \Filament\Forms\Components\Toggle::make($path)->label($label);
            } elseif (is_int($value) || is_float($value)) {
                $fields[] = TextInput::make($path)->label($label)->numeric();
            } else {
                $fields[] = Textarea::make($path)->label($label)->rows(2)->autosize();
            }
        }
        return $fields;
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('page_slug')->columns([
            TextColumn::make('page_slug')->label('Страница')->searchable()->sortable(),
            TextColumn::make('group_key')->label('Группа')->searchable(),
            TextColumn::make('title')->label('Элемент')->searchable()->wrap(),
        ])->recordActions([EditAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListExploreContentItems::route('/'),
            'edit' => EditExploreContentItem::route('/{record}/edit'),
        ];
    }
}
