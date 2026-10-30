<?php

namespace App\Filament\Resources\ExploreContentPages;

use App\Filament\Resources\ExploreContentPages\Pages\EditExploreContentPage;
use App\Filament\Resources\ExploreContentPages\Pages\ListExploreContentPages;
use App\Models\ExploreContentPage;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;
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
    protected static ?string $navigationLabel = 'Тексты страниц';
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-pencil-square';
    protected static string|\UnitEnum|null $navigationGroup = 'Самопознание';
    protected static ?int $navigationSort = 11;

    public static function canCreate(): bool { return false; }
    public static function canDeleteAny(): bool { return false; }
    public static function canDelete($record): bool { return false; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Изображения карточек — «Исследуй себя»')
                ->description('Загрузи свою картинку для каждого направления. Рекомендуемое соотношение 16:9, размер от 1200 × 675 px, JPG, PNG или WebP. После сохранения картинка появится на /explore автоматически. Если удалить изображение, вернётся исходная иллюстрация.')
                ->schema([
                    FileUpload::make('copy.card_image_numbers')->image()->imageEditor()->disk('public')->directory('explore/cards')->visibility('public')->maxSize(5120)->imagePreviewHeight('140')->label('Язык чисел'),
                    FileUpload::make('copy.card_image_emotions')->image()->imageEditor()->disk('public')->directory('explore/cards')->visibility('public')->maxSize(5120)->imagePreviewHeight('140')->label('Язык эмоций'),
                    FileUpload::make('copy.card_image_dreams')->image()->imageEditor()->disk('public')->directory('explore/cards')->visibility('public')->maxSize(5120)->imagePreviewHeight('140')->label('Язык снов'),
                    FileUpload::make('copy.card_image_archetypes')->image()->imageEditor()->disk('public')->directory('explore/cards')->visibility('public')->maxSize(5120)->imagePreviewHeight('140')->label('Язык архетипов'),
                    FileUpload::make('copy.card_image_patterns')->image()->imageEditor()->disk('public')->directory('explore/cards')->visibility('public')->maxSize(5120)->imagePreviewHeight('140')->label('Язык повторений'),
                    FileUpload::make('copy.card_image_mirror')->image()->imageEditor()->disk('public')->directory('explore/cards')->visibility('public')->maxSize(5120)->imagePreviewHeight('140')->label('Зеркало личности'),
                    FileUpload::make('copy.card_image_relationships')->image()->imageEditor()->disk('public')->directory('explore/cards')->visibility('public')->maxSize(5120)->imagePreviewHeight('140')->label('Язык отношений'),
                    FileUpload::make('copy.card_image_body')->image()->imageEditor()->disk('public')->directory('explore/cards')->visibility('public')->maxSize(5120)->imagePreviewHeight('140')->label('Язык тела'),
                    FileUpload::make('copy.card_image_choice')->image()->imageEditor()->disk('public')->directory('explore/cards')->visibility('public')->maxSize(5120)->imagePreviewHeight('140')->label('Язык выбора'),
                    FileUpload::make('copy.card_image_beliefs')->image()->imageEditor()->disk('public')->directory('explore/cards')->visibility('public')->maxSize(5120)->imagePreviewHeight('140')->label('Язык убеждений'),
                    FileUpload::make('copy.card_image_values')->image()->imageEditor()->disk('public')->directory('explore/cards')->visibility('public')->maxSize(5120)->imagePreviewHeight('140')->label('Язык ценностей'),
                    FileUpload::make('copy.card_image_fears')->image()->imageEditor()->disk('public')->directory('explore/cards')->visibility('public')->maxSize(5120)->imagePreviewHeight('140')->label('Язык страхов'),
                    FileUpload::make('copy.card_image_time')->image()->imageEditor()->disk('public')->directory('explore/cards')->visibility('public')->maxSize(5120)->imagePreviewHeight('140')->label('Язык времени'),
                    FileUpload::make('copy.card_image_conflicts')->image()->imageEditor()->disk('public')->directory('explore/cards')->visibility('public')->maxSize(5120)->imagePreviewHeight('140')->label('Язык внутренних конфликтов'),
                    FileUpload::make('copy.card_image_attention')->image()->imageEditor()->disk('public')->directory('explore/cards')->visibility('public')->maxSize(5120)->imagePreviewHeight('140')->label('Язык внимания'),
                ])
                ->visible(fn (?ExploreContentPage $record): bool => $record?->slug === 'shared')
                ->columns(2)
                ->columnSpanFull(),
            Section::make('Обложка страницы направления')
                ->description('Отдельная обложка внутри страницы — в правом верхнем блоке рядом с описанием. Рекомендуемый размер от 1200 × 900 пикселей. Если удалить изображение, останется текущая декоративная композиция. Обложки карточек общего каталога настраиваются выше, в «Общих элементах».')
                ->schema([
                    FileUpload::make('copy.cover_image')
                        ->label('Изображение обложки страницы')
                        ->image()
                        ->imageEditor()
                        ->disk('public')
                        ->directory('explore/covers')
                        ->visibility('public')
                        ->maxSize(5120)
                        ->imagePreviewHeight('200'),
                ])
                ->visible(fn (?ExploreContentPage $record): bool => in_array($record?->slug, [
                    'relationships', 'body', 'choice', 'beliefs', 'values',
                    'fears', 'time', 'conflicts', 'attention',
                ], true))
                ->columnSpanFull(),
            Section::make('Тексты и блоки')
                ->description('Здесь редактируются заголовки, описания, кнопки и другие фразы страницы. Открывайте блоки по очереди. Тексты самих эмоций, снов, сценариев и вопросов находятся рядом: «Материалы и вопросы». После сохранения достаточно обновить страницу сайта.')
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
