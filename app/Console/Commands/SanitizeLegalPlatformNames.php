<?php

namespace App\Console\Commands;

use App\Models\LegalDocument;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SanitizeLegalPlatformNames extends Command
{
    protected $signature = 'legal:sanitize-platforms {--dry-run : Show changes without saving}';
    protected $description = 'Remove unnecessary named platform and infrastructure disclosures from published legal documents';

    public function handle(): int
    {
        $rules = [
            'privacy' => [
                '6. Доступ к данным и их защита' => null,
            ],
            'terms' => [
                'Сайт может содержать ссылки на Telegram, YouTube, Tribute и иные независимые сервисы.' => 'Сайт может содержать ссылки на независимые коммуникационные, видеохостинговые и платёжные платформы.',
            ],
            'offer' => [
                'На момент подготовки документа платежи могут приниматься через Tribute; впоследствии могут добавляться иные сервисы.' => 'Оплата осуществляется через платёжный сервис, указанный на странице оформления покупки; доступные способы оплаты могут изменяться.',
                'Доступ может предоставляться через Telegram, сайт, видеоплатформы и другие указанные каналы.' => 'Доступ может предоставляться через сайт, мессенджеры, видеоплатформы и другие каналы, указанные в конкретном предложении.',
            ],
        ];
        $section6 = <<<'TEXT'
6. Доступ к данным и их защита

Данные, собираемые непосредственно сайтом, используются владельцем проекта и уполномоченными им лицами для обеспечения работы сайта, анализа его эффективности, предоставления услуг и улучшения пользовательского опыта.

Для функционирования сайта могут привлекаться сторонние поставщики технической инфраструктуры, платёжных, коммуникационных и аналитических услуг. Такие поставщики обрабатывают данные в объёме, необходимом для соответствующих функций и на применимых правовых основаниях.

При согласии посетителя сведения о взаимодействии с сайтом могут передаваться поставщикам рекламных и аналитических технологий. Внутренняя аналитика сайта не предоставляется сторонним организациям в виде готовых отчётов или выгрузок по умолчанию.

Доступ к информации ограничивается назначением данных и применяемыми мерами безопасности. Подробности обработки рекламных данных описаны в разделе 5.
TEXT;

        foreach ($rules as $slug => $replacements) {
            DB::transaction(function () use ($slug, $replacements, $section6) {
                $doc = LegalDocument::query()->where('slug', $slug)->lockForUpdate()->first();
                if (!$doc) { $this->warn("Missing document: {$slug}"); return; }
                $old = (string) $doc->content;
                $new = $old;
                if ($slug === 'privacy') {
                    $pattern = '/6\. (?:Кому передаются данные|Доступ к данным и сторонние сервисы|Доступ к данным и их защита)\s*.*?(?=\s*7\. Международные передачи)/su';
                    $new = preg_replace($pattern, $section6."\n\n", $new, 1, $count);
                    if ($count !== 1) { $this->error('Privacy section 6 not found; skipped.'); return; }
                    $new = str_replace('Используемые сервисы могут включать Vultr, Telegram, Tribute, Meta, Google/YouTube, Zoom и поставщика электронной почты; фактический список и роли должны быть проверены до публикации.', 'Фактические категории получателей и основания передачи определяются действующими интеграциями.', $new);
                    $new = str_replace('Сайт размещён на инфраструктуре Vultr', 'Сайт размещён на инфраструктуре поставщика хостинга', $new);
                } else {
                    foreach ($replacements as $from => $to) { if ($to !== null) $new = str_replace($from, $to, $new); }
                }
                if ($new === $old) { $this->line("{$slug}: no changes"); return; }
                if ($this->option('dry-run')) { $this->line("{$slug}: changes ready"); return; }
                $doc->versions()->create([
                    'title' => $doc->title, 'content' => $doc->content,
                    'version' => $doc->version, 'effective_at' => $doc->effective_at,
                    'archived_at' => now(),
                ]);
                $doc->content = $new;
                $doc->version = '2.3';
                $doc->effective_at = now()->toDateString();
                $doc->save();
                $this->info("{$slug}: updated, previous version archived");
            });
        }
        return self::SUCCESS;
    }
}
