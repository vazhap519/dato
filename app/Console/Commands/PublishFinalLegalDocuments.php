<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\LegalDocument;
class PublishFinalLegalDocuments extends Command {
 protected $signature = 'legal:publish-final';
 protected $description = 'Replace published legal texts and archive earlier editions';
 public function handle(): int {
  $names=['privacy'=>'Политика конфиденциальности','terms'=>'Условия использования','offer'=>'Публичная оферта'];
  $texts=[];
  foreach($names as $slug=>$title) {
   $path=base_path("legal-final/{$slug}.txt");
   if(!is_file($path)) { $this->error("Missing: {$path}"); return self::FAILURE; }
   $texts[$slug]=trim(file_get_contents($path));
   if(mb_strlen($texts[$slug])<3000 || !str_contains($texts[$slug],'Редакция 3.0')) { $this->error("Invalid: {$slug}"); return self::FAILURE; }
  }
  DB::transaction(function() use($names,$texts) {
   foreach($names as $slug=>$title) {
    $doc=LegalDocument::where('slug',$slug)->lockForUpdate()->firstOrFail();
    if($doc->content===$texts[$slug] && $doc->version==='3.0') continue;
    $doc->versions()->create(['title'=>$doc->title,'content'=>$doc->content,'version'=>$doc->version,'effective_at'=>$doc->effective_at,'archived_at'=>now()]);
    $doc->update(['title'=>$title,'content'=>$texts[$slug],'version'=>'3.0','effective_at'=>'2026-10-28','is_published'=>true]);
    $this->info("Updated: {$slug}");
   }
  });
  return self::SUCCESS;
 }
}
