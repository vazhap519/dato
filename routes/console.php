<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment('Laravel 12 💛');
})->purpose('Display an inspiring quote');

Schedule::command('sitemap:generate')->daily();

Schedule::command('mailing:practice-reminders')->everyMinute()->withoutOverlapping();

// Check event-triggered email automations every minute.
\Illuminate\Support\Facades\Schedule::command('mailing:automations')->everyMinute()->withoutOverlapping();

 
// Delete anonymous duplicate-submission receipts after 90 days.
// Daily aggregate totals remain available, but no per-completion token persists.
Schedule::call(static function (): void {
    if (\Illuminate\Support\Facades\Schema::hasTable('archetype_mirror_receipts')) {
        \Illuminate\Support\Facades\DB::table('archetype_mirror_receipts')
            ->where('created_at', '<', now()->subDays(90))
            ->delete();
    }
})->dailyAt('04:15');
