<?php

namespace App\Filament\Resources\ExploreContentItems;

use App\Filament\Resources\ExploreContentItems\Pages\EditExploreContentItem;
use App\Filament\Resources\ExploreContentItems\Pages\ListExploreContentItems;
use App\Models\ExploreContentItem;
use App\Support\ExploreContent;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ExploreContentItemResource extends Resource
{
    protected static ?string $model = ExploreContentItem::class;
    protected static ?string $navigationLabel = 'Материалы и вопросы';
    protected static ?string $modelLabel = 'материал самопознания';
    protected static ?string $pluralModelLabel = 'материалы самопознания';
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static string|\UnitEnum|null $navigationGroup = 'Самопознание';
    protected static ?int $navigationSort = 12;

    private const LABELS = [
        'name' => 'Название', 'title' => 'Заголовок', 'subtitle' => 'Подзаголовок',
        'description' => 'Описание', 'intro' => 'Вступление', 'notice' => 'Пояснение',
        'definition' => 'Что это за переживание', 'text' => 'Текст вопроса',
        'scene' => 'Жизненная ситуация', 'prompt' => 'Ситуация / вопрос',
        'statement' => 'Утверждение', 'question' => 'Вопрос к себе',
        'questions' => 'Вопросы к себе', 'options' => 'Варианты ответа',
        'label' => 'Надпись на кнопке', 'icon' => 'Код иконки',
        'body' => 'Телесные ощущения', 'thoughts' => 'Мысли', 'triggers' => 'Возможные причины',
        'needs' => 'Потребности', 'helpful' => 'Чем полезно', 'trap' => 'Ограничения',
        'distinction' => 'Важное различие', 'example' => 'Жизненный пример',
        'dream' => 'Описание сна', 'reflection' => 'Размышление',
        'automatic' => 'Автоматическая реакция', 'alternative' => 'Другой способ ответа',
        'practices' => 'Практики', 'soft' => 'При слабом переживании',
        'steady' => 'При умеренном переживании', 'strong' => 'При сильном переживании',
        'strength' => 'Сильная сторона', 'shadow' => 'Теневая сторона',
        'lead' => 'Объяснение реакции', 'gift' => 'Чем помогает',
        'cost' => 'Возможная цена', 'experiment' => 'Практический эксперимент',
        'pattern' => 'Привычная реакция', 'outcomes' => 'Варианты исхода',
        'impact' => 'Что произошло', 'insight' => 'Что можно заметить',
        'next' => 'Следующий шаг', 'responses' => 'Разборы ответов',
        'value' => 'Что помогает выбранному варианту', 'risk' => 'На что обратить внимание',
        'when' => 'Когда подходит', 'steps' => 'Шаги практики',
        'closing' => 'После практики', 'caution' => 'Важное предупреждение',
        'tags' => 'Поисковые слова', 'minutes' => 'Продолжительность, минут',
        'topic' => 'Тема', 'left' => 'Левый способ', 'right' => 'Правый способ',
        'leftText' => 'Описание левого способа', 'rightText' => 'Описание правого способа',
        'middleText' => 'Описание середины', 'practice' => 'Совет / практика',
        'scale' => 'Шкала ответов', 'feelings' => 'Чувства и ассоциации',
        'category' => 'Категория (служебная связь)', 'group' => 'Группа (служебная связь)',
        'slug' => 'Код (не менять)', 'id' => 'Код записи (не менять)',
        'version' => 'Версия (не менять)', 'reverse' => 'Направление подсчёта (не менять)',
        'axis' => 'Тема подсчёта (не менять)', 'related' => 'Связанные коды (не менять)',
        'slugs' => 'Коды группы (не менять)',
    ];

    private const LOCKED = ['slug', 'id', 'group', 'category', 'axis', 'reverse', 'version', 'related', 'slugs'];

    public static function canCreate(): bool { return false; }
    public static function canDeleteAny(): bool { return false; }
    public static function canDelete($record): bool { return false; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Выбранный материал')->schema([
                TextInput::make('title')->label('Название в списке редактора')->required()->maxLength(255),
                TextInput::make('page_slug')->label('Направление')->disabled()->dehydrated(false),
                TextInput::make('document')->label('Справочник')->disabled()->dehydrated(false),
                TextInput::make('group_key')->label('Тип материала')->disabled()->dehydrated(false),
                TextInput::make('entry_key')->label('Служебный код')->disabled()->dehydrated(false),
            ])->columns(2),
            Section::make('Тексты, вопросы и варианты')
                ->description('Каждая подпись и фраза заполнена исходным текстом сайта. Раскрывайте вложенные блоки и меняйте текст. Служебные коды и позиции ответов защищены, чтобы не сломать тесты и статистику.')
                ->schema(fn (?ExploreContentItem $record): array => $record
                    ? static::fieldsFor($record->payload ?? [], 'payload', $record)
                    : [])
                ->columns(1)->columnSpanFull(),
        ]);
    }

    private static function fieldsFor(array $data, string $prefix, ExploreContentItem $record, int $depth = 0): array
    {
        $fields = [];

        foreach ($data as $key => $value) {
            $name = (string) $key;
            $path = $prefix.'.'.$name;
            $index = is_numeric($key) ? (int) $key : null;
            $label = $index !== null ? '№ '.($index + 1) : (self::LABELS[$name] ?? ucfirst(str_replace('_', ' ', $name)));
            $locked = in_array($name, self::LOCKED, true)
                || ($record->document === 'archetype-situations'
                    && $record->group_key === 'categories' && $name === 'value');

            // Stable technical lists are shown by their owning logic and are
            // not text fields; allowing changes here would break references.
            if ($locked && is_array($value)) {
                continue;
            }

            if (is_array($value)) {
                if (array_is_list($value) && $value === []) {
                    continue;
                }
                $children = static::fieldsFor($value, $path, $record, $depth + 1);
                $fields[] = Section::make($label)
                    ->schema($children)->collapsible()
                    ->collapsed($depth > 0)
                    ->columns(1)->columnSpanFull();
                continue;
            }

            if (is_bool($value)) {
                $field = Toggle::make($path)->label($label);
            } elseif (is_int($value) || is_float($value)) {
                $field = TextInput::make($path)->label($label)->numeric();
            } else {
                $field = Textarea::make($path)
                    ->label($label)
                    ->rows(mb_strlen((string) $value) > 160 ? 4 : 2)
                    ->columnSpanFull();
            }

            if ($locked || ($index !== null && in_array((string) $key, ['related', 'slugs'], true))) {
                $field->disabled()->dehydrated(false)
                    ->helperText('Это служебная связь. Меняйте текстовые подписи, но не коды.');
            }
            $fields[] = $field;
        }

        return $fields;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('page_slug')->label('Направление')->formatStateUsing(
                    fn ($state) => ExploreContent::PAGES[$state] ?? $state,
                )->sortable(),
                TextColumn::make('group_key')->label('Блок')->searchable(),
                TextColumn::make('title')->label('Карточка / вопрос')->searchable()->wrap(),
                TextColumn::make('document')->label('Источник')->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('page_slug')->label('Направление')->options(
                    collect(ExploreContent::PAGES)->except('shared')->all(),
                ),
                SelectFilter::make('document')->label('Справочник')->options(
                    collect(ExploreContent::DOCUMENTS)->mapWithKeys(
                        fn ($page, $document) => [$document => $document],
                    )->all(),
                ),
            ])
            ->recordActions([EditAction::make()])
            ->defaultSort('page_slug');
    }

    public static function getPages(): array
    {
        return [
            'index' => ListExploreContentItems::route('/'),
            'edit' => EditExploreContentItem::route('/{record}/edit'),
        ];
    }
}
