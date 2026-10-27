<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use App\Models\ClosedGroup;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';
    protected $description = 'Generate sitemap.xml';

    public function handle()
    {
        $sitemap = Sitemap::create();

        // Static Pages
        $sitemap->add(Url::create('/')->setPriority(1.0));
        $sitemap->add(Url::create('/personal')->setPriority(0.9));
        $sitemap->add(Url::create('/editoria')->setPriority(0.9));
        $sitemap->add(Url::create('/shop')->setPriority(0.8));
        $sitemap->add(Url::create('/links')->setPriority(0.7));
        $sitemap->add(Url::create('/legal')->setPriority(0.3));

        foreach (['terms', 'privacy', 'offer'] as $slug) {
            if (\App\Models\LegalDocument::where('slug', $slug)->where('is_published', true)->exists()) {
                $sitemap->add(Url::create('/'.$slug)->setPriority(0.3));
            }
        }

        // Dynamic Closed Groups
        ClosedGroup::whereNotNull('slug')->where('slug', '<>', '')->get()->each(function ($group) use ($sitemap) {
            $sitemap->add(
                Url::create("/closed-group/{$group->slug}")
                    ->setLastModificationDate($group->updated_at)
                    ->setPriority(0.9)
            );
        });

        $sitemap->writeToFile(public_path('sitemap.xml'));

        $this->info('Sitemap generated successfully.');
    }
}
