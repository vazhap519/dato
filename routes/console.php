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
