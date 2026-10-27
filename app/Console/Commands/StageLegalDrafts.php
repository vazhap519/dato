<?php

namespace App\Console\Commands;

use App\Models\LegalDocument;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class StageLegalDrafts extends Command
{
    protected $signature = 'legal:stage-drafts {--publish : Publish drafts after explicit legal approval}';
    protected $description = 'Stage reviewed international legal drafts, retaining prior versions';

    public function handle(): int
    {
        $files = ['terms' => 'terms.txt', 'privacy' => 'privacy.txt', 'offer' => 'offer.txt'];
        foreach ($files as $slug => $file) {
            $path = base_path('legal-drafts/'.$file);
            if (!is_file($path)) {
                $this->error("Missing draft: {$path}");
                return self::FAILURE;
            }
        }
        DB::transaction(function () use ($files) {
            foreach ($files as $slug => $file) {
                $record = LegalDocument::query()->where('slug', $slug)->lockForUpdate()->firstOrFail();
                if ($record->content && $record->content !== file_get_contents(base_path('legal-drafts/'.$file))) {
                    $record->versions()->create([
                        'title' => $record->title,
                        'content' => $record->content,
                        'version' => $record->version,
                        'effective_at' => $record->effective_at,
                        'archived_at' => now(),
                    ]);
                }
                $record->title = match ($slug) {
                    'terms' => 'Условия использования',
                    'privacy' => 'Политика конфиденциальности',
                    'offer' => 'Публичная оферта',
                };
                $record->content = file_get_contents(base_path('legal-drafts/'.$file));
                $record->version = '2.0-draft';
                $record->effective_at = null;
                $record->is_published = (bool) $this->option('publish');
                $record->save();
                $this->line("Staged /{$slug}: ".($record->is_published ? 'published' : 'unpublished'));
            }
        });
        return self::SUCCESS;
    }
}
