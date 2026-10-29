<?php

namespace App\Console\Commands;

use App\Models\LegalDocument;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PublishArchetypePrivacy extends Command
{
    protected $signature = 'legal:publish-archetype-privacy';
    protected $description = 'Publish privacy notice for automatically aggregated archetype-mirror answers, preserving prior versions';

    public function handle(): int
    {
        $notice = "Статистика исследования «Зеркало архетипов» (/explore/archetypes/mirror). "
            ."При завершении всех 20 ситуаций выбранные варианты ответов автоматически направляются на сервер для подсчёта общей статистики: частоты выбора вариантов и распределения архетипов. "
            ."Для подсчёта сервер временно обрабатывает набор ответов, после чего сохраняет только суммарные показатели по дням и вопросам; отдельные анкеты, имена и Telegram ID в таблицах статистики не сохраняются. "
            ."Для предотвращения повторного учёта одного прохождения используется случайный идентификатор попытки: на сервере хранится только его хеш, который удаляется не позднее чем через 90 дней. "
            ."IP-адрес может присутствовать в обычных технических журналах веб-сервера, но не записывается в таблицы ответов. "
            ."Исследование предназначено для самонаблюдения и не является медицинской или психологической диагностикой.";

        $result = DB::transaction(function () use ($notice) {
            $doc = LegalDocument::query()->where('slug', 'privacy')->lockForUpdate()->first();
            if (! $doc || ! $doc->is_published) {
                $this->error('Опубликованная политика конфиденциальности не найдена. Изменения не внесены.');
                return self::FAILURE;
            }

            if (str_contains($doc->content, 'Статистика исследования «Зеркало архетипов»')) {
                $this->info('Уведомление об исследовании уже опубликовано. Изменения не нужны.');
                return self::SUCCESS;
            }

            // Do not overwrite privacy edits made independently after version 3.0.
            if ($doc->version !== '3.0') {
                $this->error('Редакция политики уже отличается от 3.0: '.$doc->version.'. Не изменяем автоматически.');
                return self::FAILURE;
            }

            $anchor = "На странице практикума /editoria";
            if (! str_contains($doc->content, $anchor)) {
                $this->error('Не найден ожидаемый раздел аналитики. Опубликованная политика не изменена.');
                return self::FAILURE;
            }

            $updated = str_replace($anchor, $notice."\n\n".$anchor, $doc->content);
            $updated = preg_replace('/^Редакция 3\\.0.*$/mu',
                'Редакция 3.1 · '.now()->format('d.m.Y'), $updated, 1, $changed);
            if ($changed !== 1 || ! str_contains($updated, $notice)) {
                $this->error('Не удалось подготовить обновление. Политика не изменена.');
                return self::FAILURE;
            }

            $doc->versions()->create([
                'title' => $doc->title,
                'content' => $doc->content,
                'version' => $doc->version,
                'effective_at' => $doc->effective_at,
                'archived_at' => now(),
            ]);
            $doc->content = $updated;
            $doc->version = '3.1';
            $doc->effective_at = now()->startOfDay();
            $doc->save();
            $this->info('Опубликована политика конфиденциальности 3.1 с уведомлением об автоматической статистике.');
            return self::SUCCESS;
        });

        return $result;
    }
}
