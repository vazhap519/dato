<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AdvancedSeoAudit extends Command
{
    protected $signature = 'seo:advanced';
    protected $description = 'Run full professional SEO analysis (Internal Engine)';

    public function handle()
    {
        $routes = [
            '/',
            '/personal',
            '/practice',
            '/legal',
            '/editoria',
        ];

        $this->info("🚀 FULL ADVANCED SEO ANALYSIS\n");

        foreach ($routes as $route) {

            $this->line("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            $this->info("🔍 Checking: {$route}");

            $request = Request::create($route, 'GET');
            $response = Http::withHeaders([
                'User-Agent' => 'SEO-Bot',
                'Accept' => 'text/html',
            ])->timeout(15)->get(config('app.url') . $route);

            if (!$response->ok()) {
                $this->error("❌ HTTP Error: " . $response->status());
                continue;
            }

            $html = $response->body(); // ✅ სწორია

            $this->checkTitle($html);
            $this->checkDescription($html);
            $this->checkH1($html);
            $this->checkCanonical($html, $route);
            $this->checkOgTags($html);
            $this->checkSchema($html);
            $this->checkImages($html);
            $this->checkAltTags($html);
            $this->checkHtmlSize($html);
        }

        $this->checkSitemap();
        $this->checkRobots();

        $this->info("\n✅ ADVANCED SEO ANALYSIS COMPLETE");
    }

    private function checkTitle($html)
    {
        preg_match('/<title>(.*?)<\/title>/i', $html, $matches);

        if (!isset($matches[1])) {
            $this->error("❌ Missing Title");
            return;
        }

        $length = strlen(trim($matches[1]));
        $this->line("✔ Title ({$length} chars)");

        if ($length < 30 || $length > 65) {
            $this->warn("⚠ Title length not optimal (30–65 recommended)");
        }
    }

    private function checkDescription($html)
    {
        preg_match('/<meta name="description" content="(.*?)"/i', $html, $matches);

        if (!isset($matches[1])) {
            $this->error("❌ Missing Meta Description");
            return;
        }

        $length = strlen($matches[1]);
        $this->line("✔ Description ({$length} chars)");

        if ($length < 120 || $length > 170) {
            $this->warn("⚠ Description length not optimal (140–160 recommended)");
        }
    }

    private function checkH1($html)
    {
        preg_match_all('/<h1/i', $html, $matches);
        $count = count($matches[0]);

        if ($count === 0) {
            $this->error("❌ No H1 found");
        } elseif ($count > 1) {
            $this->warn("⚠ Multiple H1 detected ({$count})");
        } else {
            $this->line("✔ Single H1");
        }
    }

    private function checkCanonical($html, $route)
    {
        preg_match('/rel="canonical" href="(.*?)"/i', $html, $matches);

        if (!isset($matches[1])) {
            $this->warn("⚠ Missing Canonical");
            return;
        }

        $this->line("✔ Canonical detected");
    }

    private function checkOgTags($html)
    {
        foreach (['og:title', 'og:description', 'og:image'] as $tag) {
            if (str_contains($html, 'property="'.$tag.'"')) {
                $this->line("✔ {$tag}");
            } else {
                $this->warn("⚠ Missing {$tag}");
            }
        }
    }

    private function checkSchema($html)
    {
        preg_match_all('/<script type="application\/ld\+json">(.*?)<\/script>/s', $html, $matches);

        if (empty($matches[1])) {
            $this->warn("⚠ No Schema.org detected");
            return;
        }

        $this->info("✔ Schema detected");
    }

    private function checkImages($html)
    {
        preg_match_all('/<img[^>]+src="([^">]+)"/i', $html, $matches);

        if (empty($matches[1])) {
            $this->line("✔ No images found");
            return;
        }

        $this->line("✔ Images found: " . count($matches[1]));
    }

    private function checkAltTags($html)
    {
        preg_match_all('/<img[^>]+>/i', $html, $matches);

        foreach ($matches[0] as $imgTag) {
            if (!preg_match('/alt="/i', $imgTag)) {
                $this->warn("⚠ Image missing alt attribute");
                return;
            }
        }

        $this->line("✔ All images have alt");
    }

    private function checkHtmlSize($html)
    {
        $size = strlen($html) / 1024;
        $this->line("✔ HTML Size: " . round($size, 2) . " KB");

        if ($size > 300) {
            $this->warn("⚠ Large HTML (>300KB)");
        }
    }

    private function checkSitemap()
    {
        $response = app()->handle(Request::create('/sitemap.xml', 'GET'));

        if ($response->getStatusCode() === 200) {
            $this->info("✔ Sitemap OK");
        } else {
            $this->error("❌ Sitemap missing");
        }
    }

    private function checkRobots()
    {
        $response = app()->handle(Request::create('/robots.txt', 'GET'));

        if ($response->getStatusCode() === 200) {
            $this->info("✔ Robots OK");
        } else {
            $this->error("❌ Robots missing");
        }
    }
}
