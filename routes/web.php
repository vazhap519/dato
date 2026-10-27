<?php

use App\Http\Controllers\ClosedGroupController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\PracticeController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Inertia\Inertia;
use App\Http\Controllers\PersonalController;
use Spatie\Sitemap\SitemapGenerator;
use App\Models\SiteSetting;
Route::get('/', [HomeController::class, 'home'])->name('home');
Route::get('/links', function () {
    return Inertia::render('Links', [
        'links' => \App\Models\UsefulLink::query()
            ->where('is_active', true)
            ->orderBy('sort')
            ->orderBy('id')
            ->get(['id', 'title', 'description', 'url', 'icon']),
    ]);
})->name('links');
// Limit chat messages per guest session rather than per shared IP address.
RateLimiter::for('live-chat', function (\Illuminate\Http\Request $request) {
    $guestId = $request->session()->get('live_guest_id');
    $moderatorId = $request->session()->get('live_moderator_id');
    $key = $moderatorId ? 'moderator:'.$moderatorId : ($guestId ? 'guest:'.$guestId : 'ip:'.$request->ip());
    return [Limit::perMinute(30)->by('minute:'.$key), Limit::perSecond(1, 2)->by('second:'.$key)];
});

// Limit chat registration per browser session, with a separate broad IP safeguard.
RateLimiter::for('live-join', function (\Illuminate\Http\Request $request) {
    $sessionKey = hash('sha256', $request->session()->getId());
    return [
        Limit::perMinute(15)->by('session:'.$sessionKey),
        Limit::perMinute(120)->by('ip:'.$request->ip()),
    ];
});

// Each live session belongs to one practice day; messages are isolated by session.
Route::get('/moderator/{token}', [\App\Http\Controllers\LiveModeratorAuthController::class, 'show'])->name('live.moderator.show')->middleware('throttle:30,1');
Route::post('/moderator/{token}', [\App\Http\Controllers\LiveModeratorAuthController::class, 'login'])->name('live.moderator.login')->middleware('throttle:10,1');
Route::post('/moderator/logout', [\App\Http\Controllers\LiveModeratorAuthController::class, 'logout'])->name('live.moderator.logout');
Route::get('/live', [\App\Http\Controllers\LiveController::class, 'index'])->name('live');
Route::get('/live/guest', [\App\Http\Controllers\LiveController::class, 'guest']);
Route::post('/live/join', [\App\Http\Controllers\LiveController::class, 'join'])->middleware('throttle:live-join');
Route::get('/live/api/sessions/{session}', [\App\Http\Controllers\LiveController::class, 'session']);
Route::get('/live/api/sessions/{session}/messages', [\App\Http\Controllers\LiveController::class, 'messages'])->middleware('throttle:120,1');
Route::post('/live/api/sessions/{session}/messages', [\App\Http\Controllers\LiveController::class, 'send'])->middleware('throttle:live-chat');
Route::post('/live/api/sessions/{session}/presence', [\App\Http\Controllers\LiveController::class, 'presence'])->middleware('throttle:12,1');
Route::post('/live/api/sessions/{session}/host-message', [\App\Http\Controllers\LiveController::class, 'hostSend'])->middleware('throttle:30,1');
Route::post('/live/api/sessions/{session}/chat-control', [\App\Http\Controllers\LiveController::class, 'chatControl']);
Route::post('/live/api/sessions/{session}/messages/{message}/moderate', [\App\Http\Controllers\LiveController::class, 'moderate']);

Route::post('/live/api/sessions/{session}/buttons', [App\Http\Controllers\LiveController::class, 'createButton']);
Route::put('/live/api/sessions/{session}/buttons/{button}', [App\Http\Controllers\LiveController::class, 'updateButton']);
Route::post('/live/api/sessions/{session}/buttons/{button}/remove', [App\Http\Controllers\LiveController::class, 'deleteButton']);
Route::post('/analytics/event', [\App\Http\Controllers\SiteAnalyticsController::class, 'store'])->middleware('throttle:120,1');
Route::get('/numbers', [\App\Http\Controllers\NumberMeaningController::class, 'index'])->name('numbers.index');
Route::get('/numbers/{number}', [\App\Http\Controllers\NumberMeaningController::class, 'show'])
    ->where('number', '[0-9]{1,12}')->name('numbers.show');
Route::fallback(function () {
    return Inertia::render('Error/NotFound')
        ->toResponse(request())
        ->setStatusCode(404);
});

Route::get('/personal', [PersonalController::class, 'index'])
    ->name('personal');
Route::get('/{slug}', [\App\Http\Controllers\LegalDocumentController::class, 'show'])->where('slug', 'terms|privacy|offer')->name('legal.document');
Route::get('/legal', [LegalController::class, 'index'])
    ->name('legal');
Route::get('/shop',[PracticeController::class,'index'])->name('practice');
Route::post('/editoria/register', [\App\Http\Controllers\MailingRegistrationController::class, 'store'])->middleware('throttle:10,1')->name('mailing.register');
Route::get('/mailing/verify/{contact}/{token}', [\App\Http\Controllers\MailingRegistrationController::class, 'verify'])->middleware(['signed','throttle:30,1'])->name('mailing.verify');
Route::get('/mailing/unsubscribe/{token}', [\App\Http\Controllers\MailingRegistrationController::class, 'unsubscribe'])->middleware('throttle:30,1')->name('mailing.unsubscribe');
Route::get('/editoria', [\App\Http\Controllers\EditorialController::class, 'index'])
    ->name('editoria');



//Route::get('/sitemap.xml', function () {
//
//    return SitemapGenerator::create(config('app.url'))
//        ->getSitemap()
//        ->toResponse(request());
//
//})->name('sitemap');
Route::get('/robots.txt', function () {

    $content = "User-agent: *\n";
    $content .= "Allow: /\n";
    $content .= "Sitemap: " . url('/sitemap.xml');

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
Route::get('/closed-group/{slug}', [ClosedGroupController::class, 'show'])
    ->name('closed-group.show');
