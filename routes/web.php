<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\PracticeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PersonalController;
use Spatie\Sitemap\SitemapGenerator;
use App\Models\SiteSetting;
Route::get('/', [HomeController::class, 'home'])->name('home');
Route::fallback(function () {
    return Inertia::render('Error/NotFound')
        ->toResponse(request())
        ->setStatusCode(404);
});

Route::get('/personal', [PersonalController::class, 'index'])
    ->name('personal');
Route::get('/legal', [LegalController::class, 'index'])
    ->name('legal');
Route::get('/shop',[PracticeController::class,'index'])->name('practice');
Route::get('/editoria', [\App\Http\Controllers\EditorialController::class, 'index'])
    ->name('editoria');



Route::get('/sitemap.xml', function () {

    return SitemapGenerator::create(config('app.url'))
        ->getSitemap()
        ->toResponse(request());

})->name('sitemap');
Route::get('/robots.txt', function () {

    $content = "User-agent: *\n";
    $content .= "Allow: /\n";
    $content .= "Sitemap: " . route('sitemap');

    return response($content, 200)
        ->header('Content-Type', 'text/plain');

});




Route::get('/site.webmanifest', function () {

    $settings = SiteSetting::first();

    return response()->json([
        "name" => $settings?->site_name ?? config('app.name'),
        "short_name" => $settings?->site_name ?? config('app.name'),
        "icons" => [
            [
                "src" => $settings?->favicon_url ?? '/favicon.ico',
                "sizes" => "192x192",
                "type" => "image/png"
            ]
        ],
        "theme_color" => "#000000",
        "background_color" => "#000000",
        "display" => "standalone"
    ]);

})->name('manifest');
