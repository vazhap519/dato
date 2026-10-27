<?php

namespace App\Console\Commands;

use App\Models\LegalDocument;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ClarifyPrivacyRecipients extends Command
{
    protected $signature = 'privacy:clarify-recipients';
    protected $description = 'Clarify recipients in the published privacy policy without touching other sections';

    public function handle(): int
    {
        $replacement = <<<'TEXT'
6. Доступ к данным и сторонние сервисы

Внутренняя аналитика посещений и событий сайта предназначена для владельца arutyun.me и уполномоченных им администраторов. Она не передаётся Telegram, Tribute, Zoom, YouTube или другим сторонним сервисам в виде отчётов либо выгрузок по умолчанию.

Сайт размещён на инфраструктуре Vultr. Хостинг-провайдер может технически обрабатывать данные, необходимые для работы и защиты сервера. Это не равнозначно предоставлению ему доступа к внутренним отчётам аналитики.

При согласии посетителя Meta Pixel на странице /editoria может передавать Meta сведения о посещении страницы и рекламных событиях. Meta не получает по этой причине доступ к базе собственной аналитики сайта.

При переходе посетителя в Telegram, оплате через Tribute, просмотре материалов на YouTube или участии во встречах Zoom соответствующий сервис может самостоятельно обрабатывать сведения, возникающие при использовании его платформы. Это не означает автоматической передачи ему внутренней аналитики arutyun.me.

Передача данных и доступ к ним ограничиваются конкретными целями и действующими интеграциями. Фактические настройки и получатели должны периодически проверяться.
TEXT;
        DB::transaction(function () use ($replacement) {
            $doc = LegalDocument::query()->where('slug', 'privacy')->lockForUpdate()->firstOrFail();
            if (str_contains((string) $doc->content, '6. Доступ к данным и сторонние сервисы')) {
                $this->info('Section 6 already clarified.');
                return;
            }
            $pattern = '/6\. Кому передаются данные\s*.*?(?=\s*7\. Международные передачи)/su';
            $updated = preg_replace($pattern, $replacement."\n\n", (string) $doc->content, 1, $count);
            if ($count !== 1) {
                throw new \RuntimeException('Section 6 not found; no changes were saved.');
            }
            $doc->versions()->create([
                'title' => $doc->title, 'content' => $doc->content,
                'version' => $doc->version, 'effective_at' => $doc->effective_at,
                'archived_at' => now(),
            ]);
            $doc->content = $updated;
            $doc->version = '2.2';
            $doc->effective_at = now()->toDateString();
            $doc->save();
            $this->info('Published section 6 updated; previous version archived.');
        });
        return self::SUCCESS;
    }
}
