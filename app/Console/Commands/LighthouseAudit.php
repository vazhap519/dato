<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class LighthouseAudit extends Command
{
    protected $signature = 'seo:lighthouse
                            {url? : URL to audit}
                            {--desktop : Run desktop mode}';

    protected $description = 'Run Lighthouse CLI audit (Stable Windows Version)';

    public function handle()
    {
        $url = $this->argument('url') ?? config('app.url');

        if (!$url) {
            $this->error('❌ No URL provided and APP_URL not set.');
            return Command::FAILURE;
        }

        $this->info("🚀 Running Lighthouse on: {$url}");

        $outputPath = storage_path('app/lighthouse.json');

        // Desktop preset only if requested
        $presetOption = $this->option('desktop') ? '--preset=desktop' : '';

        // Windows Chrome path (adjust if needed)
        $chromePath = '"C:\Program Files\Google\Chrome\Application\chrome.exe"';

        $command = sprintf(
            'lighthouse %s %s --output=json --output-path=%s --chrome-path=%s --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --disable-extensions"',
            escapeshellarg($url),
            $presetOption,
            escapeshellarg($outputPath),
            $chromePath
        );

        exec($command, $output, $exitCode);

        // Even if exitCode fails (Windows EPERM), check if JSON exists
        if (!file_exists($outputPath)) {
            $this->error("❌ Lighthouse JSON report not generated.");
            return Command::FAILURE;
        }

        $json = json_decode(file_get_contents($outputPath), true);

        if (!$json || !isset($json['categories'])) {
            $this->error("❌ Invalid Lighthouse JSON structure.");
            return Command::FAILURE;
        }

        $performance = round(($json['categories']['performance']['score'] ?? 0) * 100);
        $seo = round(($json['categories']['seo']['score'] ?? 0) * 100);
        $accessibility = round(($json['categories']['accessibility']['score'] ?? 0) * 100);
        $bestPractices = round(($json['categories']['best-practices']['score'] ?? 0) * 100);

        $this->line("");
        $this->line("━━━━━━━━━━━━━━━━━━━━━━━━━━");
        $this->info("📊 Lighthouse Results");
        $this->line("Performance:     {$performance}");
        $this->line("SEO:             {$seo}");
        $this->line("Accessibility:   {$accessibility}");
        $this->line("Best Practices:  {$bestPractices}");
        $this->line("━━━━━━━━━━━━━━━━━━━━━━━━━━");

        // Warnings
        if ($performance < 80) {
            $this->warn("⚠ Performance below recommended level (80+ recommended).");
        }

        if ($seo < 90) {
            $this->warn("⚠ SEO score below optimal (90+ recommended).");
        }

        if ($accessibility < 90) {
            $this->warn("⚠ Accessibility could be improved.");
        }

        if ($bestPractices < 90) {
            $this->warn("⚠ Best practices score could be improved.");
        }

        $this->info("✅ Lighthouse audit complete.");

        return Command::SUCCESS;
    }
}
//php artisan seo:lighthouse
