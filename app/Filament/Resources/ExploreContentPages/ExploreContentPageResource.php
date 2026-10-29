<?php

namespace App\Filament\Resources\ExploreContentPages;

use App\Filament\Resources\ExploreContentPages\Pages\EditExploreContentPage;
use App\Filament\Resources\ExploreContentPages\Pages\ListExploreContentPages;
use App\Models\ExploreContentPage;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Collection;

class ExploreContentPageResource extends Resource
{
    protected static ?string $model = ExploreContentPage::class;
    protected static ?string $modelLabel = 'страница самопознания';
    protected static ?string $pluralModelLabel = 'редактирование страниц самопознания';
    protected static ?string $navigationLabel = 'Тексты шести страниц';
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-pencil-square';
    protected static string|\UnitEnum|null $navigationGroup = 'Самопознание';
    protected static ?int $navigationSort = 11;

    public static function canCreate(): bool { return false; }
    public static function canDeleteAny(): bool { return false; }
    public static function canDelete($record): bool { return false; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Тексты и блоки')
                ->description('Все фразы этой страницы и её экранов. Открывайте блоки по очереди. Поля уже заполнены текстом сайта. После сохранения обновите страницу в браузере: GitHub и пересборка не нужны.')
                ->schema(fn (?ExploreContentPage $record): array => static::fieldsForPage($record?->slug))
                ->columnSpanFull(),
        ]);
    }

    private static function fieldsForPage(?string $slug): array
    {
        $file = resource_path('data/explore-copy-manifest.json');
        if (! is_file($file) || ! $slug) {
            return [];
        }
        $manifest = json_decode((string) file_get_contents($file), true) ?: [];
        $entries = $manifest['pages'][$slug] ?? [];
        $groups = collect($entries)->groupBy(fn (array $entry) =>
            basename($entry['source']).' · '.$entry['section']);

        return $groups->map(function (Collection $rows, string $group): Section {
            return Section::make($group)
                ->schema($rows->map(function (array $entry): Textarea {
                    $text = trim($entry['text']);
                    $lines = max(2, min(5, (int) ceil(mb_strlen($text) / 100) + 1));
                    return Textarea::make('copy.'.$entry['key'])
                        ->label($entry['label'])
                        ->rows($lines)
                        ->helperText('Фрагмент страницы · строка '.($entry['line'] ?: '?'))
                        ->columnSpanFull();
                })->all())
                ->collapsible()->collapsed()->columns(1);
        })->values()->all();
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('title')->label('Страница')->searchable(),
            TextColumn::make('slug')->label('Код'),
            TextColumn::make('updated_at')->label('Изменено')->dateTime('d.m.Y H:i')->sortable(),
        ])->recordActions([EditAction::make()])->defaultSort('id');
    }

    public static function getPages(): array
    {
        return [
            'index' => ListExploreContentPages::route('/'),
            'edit' => EditExploreContentPage::route('/{record}/edit'),
        ];
    }
}
