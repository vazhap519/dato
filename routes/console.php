<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment('Laravel 12 💛');
})->purpose('Display an inspiring quote');

Schedule::command('sitemap:generate')->daily();

Schedule::command('mailing:practice-reminders')->everyMinute()->withoutOverlapping();
