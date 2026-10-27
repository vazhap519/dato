<?php

namespace App\Console\Commands;

use App\Models\LegalDocument;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PublishAnalyticsPrivacyUpdate extends Command
{
    protected $signature = 'privacy:publish-analytics-update';
    protected $description = 'Append analytics and advertising consent disclosure to the published privacy policy, preserving its previous version';

    public function handle(): int
    {
        $section = <<<'TEXT'

АНАЛИТИКА САЙТА И РЕКЛАМНЫЕ ТЕХНОЛОГИИ (дополнение от 28.10.2026)

Сайт arutyun.me использует собственную систему аналитики для оценки посещений и взаимодействий с сайтом, а на странице /editoria — рекламную технологию Meta Pixel (Meta Platforms). Необязательные аналитические и рекламные технологии запускаются после согласия посетителя. Кнопка «ОК» разрешает оба вида отслеживания, а «Не сейчас» отклоняет оба. Продолжение просмотра сайта само по себе не означает согласия.

При согласии собственная аналитика может фиксировать адрес посещённой страницы, дату и время события, нажатия на ссылки и обозначенные кнопки, источник перехода, UTM-метки, тип устройства и браузера, случайные идентификаторы посетителя и сессии. Содержимое полей форм, пароли и сообщения посетителей для аналитики не записываются. Для сопоставления событий IP-адрес преобразуется в HMAC-хеш; исходный IP-адрес не сохраняется в таблице событий аналитики. При этом технические журналы сервера могут обрабатывать IP-адрес отдельно.

Meta Pixel после рекламного согласия может передавать Meta сведения о посещении страницы практикума и рекламных событиях. Meta может обрабатывать полученные данные по собственной политике конфиденциальности: https://www.facebook.com/privacy/policy/

Выбор сохраняется в локальном хранилище браузера (localStorage); случайные идентификаторы собственной аналитики могут сохраняться в localStorage и sessionStorage. Изменить выбор или отозвать согласие можно через «Настройки конфиденциальности» в нижней части страницы /editoria. После отзыва прекращается отправка новых событий собственной аналитики. Для прекращения работы ранее загруженного стороннего рекламного скрипта рекомендуется перезагрузить страницу. Отзыв согласия не удаляет автоматически ранее переданные сведения; по вопросам удаления и реализации прав можно обратиться в Службу Заботы: https://t.me/arutyunsupport

Технически необходимые cookie и данные сессии могут использоваться для работы и защиты сайта без необязательного аналитического отслеживания. Срок хранения аналитических событий и технических журналов зависит от действующих настроек сервера и правил удаления; оператор должен ограничивать хранение необходимым периодом. При международной передаче данных применяются требования соответствующего законодательства.
TEXT;

        DB::transaction(function () use ($section) {
            $doc = LegalDocument::query()->where('slug', 'privacy')->lockForUpdate()->firstOrFail();
            if (str_contains((string) $doc->content, 'АНАЛИТИКА САЙТА И РЕКЛАМНЫЕ ТЕХНОЛОГИИ (дополнение от 28.10.2026)')) {
                $this->info('Privacy analytics update already published. No changes.');
                return;
            }
            $doc->versions()->create([
                'title' => $doc->title,
                'content' => $doc->content,
                'version' => $doc->version,
                'effective_at' => $doc->effective_at,
                'archived_at' => now(),
            ]);
            $doc->content = rtrim((string) $doc->content)."\n\n".$section;
            $doc->version = '2.1';
            $doc->effective_at = now()->toDateString();
            $doc->is_published = true;
            $doc->save();
            $this->info('Privacy policy updated and published; previous version archived.');
        });

        return self::SUCCESS;
    }
}
