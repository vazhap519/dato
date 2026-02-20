<?php

use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'home'])->name('home');
Route::fallback(function () {
    return Inertia::render('Error/NotFound')
        ->toResponse(request())
        ->setStatusCode(404);
});

