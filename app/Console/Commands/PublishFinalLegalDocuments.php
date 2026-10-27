<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
class PublishFinalLegalDocuments extends Command {
 protected $signature = 'legal:publish-final';
 protected $description = 'Publish updated legal documents';
 public function handle(): int { $this->info('Publication command is not configured yet.'); return self::FAILURE; }
}
