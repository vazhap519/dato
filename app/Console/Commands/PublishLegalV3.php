<?php
namespace App\Console\Commands;
use App\Models\LegalDocument;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
class PublishLegalV3 extends Command {
 protected $signature='legal:publish-v3';
 protected $description='Publish full legal texts version 3.0 with history';
 public function handle(): int {
  $texts=[];
  foreach(['privacy','terms','offer'] as $slug) {
   $paths=$slug==='offer'?['offer.part1.txt','offer.part2.txt']:[$slug.'.txt'];
   $parts=[];
   foreach($paths as $name) {
    $path=base_path('legal-final/'.$name);
    if(!is_file($path)){ $this->error('Missing '.$name); return self::FAILURE; }
    $parts[]=trim(file_get_contents($path));
   }
   $texts[$slug]=implode("\n",$parts);
   if(mb_strlen($texts[$slug])<3000 || !str_contains($texts[$slug],'Редакция 3.0')){ $this->error('Invalid '.$slug); return self::FAILURE; }
  }
  DB::transaction(function() use($texts) {
   foreach($texts as $slug=>$content) {
    $doc=LegalDocument::where('slug',$slug)->lockForUpdate()->firstOrFail();
    if($doc->content===$content && $doc->version==='3.0') continue;
    $doc->versions()->create(['title'=>$doc->title,'content'=>$doc->content,'version'=>$doc->version,'effective_at'=>$doc->effective_at,'archived_at'=>now()]);
    $doc->content=$content;
    $doc->version='3.0';
    $doc->effective_at='2026-10-28';
    $doc->is_published=true;
    $doc->save();
    $this->info('Updated '.$slug);
   }
  });
  return self::SUCCESS;
 }
}
