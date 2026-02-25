<?php

namespace App\Http\Middleware;

use App\Models\LandingPage;
use App\Models\NotFound;
use App\Models\Footer;
use App\Models\Review;
use App\Models\Practice;
use App\Models\Seo; // ✅ ეს აკლდა
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            /*
            |--------------------------------------------------------------------------
            | Navigation
            |--------------------------------------------------------------------------
            */
            'navigation' => function () use ($request) {

                $routeName = $request->route()?->getName();

                $pageKey = match ($routeName) {
                    'home'      => 'home',
                    'personal'  => 'personal',
                    'practice'  => 'practice',
                    'legal'     => 'legal',
                    'editoria'  => 'editoria',
                    default     => 'home',
                };

                $page = \App\Models\LandingPage::where('key', $pageKey)
                    ->with(['navigationItems' => function ($q) {
                        $q->where('is_active', true)
                            ->orderBy('sort');
                    }])
                    ->first();

                return $page
                    ? $page->navigationItems->map(fn ($i) => [
                        'id'    => $i->id,
                        'label' => $i->label,
                        'href'  => ltrim($i->href, '#'),
                    ])->values()
                    : [];
            },

            /*
            |--------------------------------------------------------------------------
            | Footer
            |--------------------------------------------------------------------------
            */
            'footer' => fn () =>
            Footer::first()
                ? Footer::first()->toArray()
                : [
                'brand_name' => 'Давид Арутюнов',
                'description' => 'Помогаем обрести внутреннюю опору через древние мудрости и современные подходы к осознанности.',
                'nav_title' => 'Навигация',
                'support_title' => 'Поддержка',
                'support_faq' => 'FAQ',
                'support_payment' => 'Условия оплаты',
                'support_privacy' => 'Политика конфиденциальности',
                'support_offer' => 'Публичная оферта',
                'contact_title' => 'Контакты',
                'email' => 'hello@arutyunov.com',
                'location' => 'Digital Nomad / Remote',
                'copyright' => '© 2024 Давид Арутюнов. Все права защищены.',
                'youtube' => '#',
                'telegram' => '#',
                'tiktok' => '#',
            ],



            /*
            |--------------------------------------------------------------------------
            | SEO (Route Based)
            |--------------------------------------------------------------------------
            */
            'seo' => function () use ($request) {

                $routeName = $request->route()?->getName();

                if (! $routeName) return null;

                return cache()->rememberForever("seo_{$routeName}", function () use ($routeName, $request) {

                    $seo = \App\Models\Seo::where('page', $routeName)->first();

                    if (! $seo) return null;

                    return [
                        'title' => $seo->title ?? config('app.name'),
                        'description' => $seo->description,
                        'keywords' => is_array($seo->keywords)
                            ? implode(', ', $seo->keywords)
                            : $seo->keywords,
                        'image' => $seo->seo_image_url,
                        'canonical' => $seo->canonical
                            ? $seo->canonical
                            : url($request->path()),
                    ];
                });
            },

            'settings' => function () {

                return cache()->rememberForever('site_settings', function () {
                    $settings = \App\Models\SiteSetting::first();

                    if (! $settings) return null;

                    return [
                        'site_name' => $settings->site_name,
                        'favicon' => $settings->favicon_url,
                        'apple_icon' => $settings->apple_icon_url,
                        'og_default' => $settings->og_default_url,
                    ];
                });
            },
        ];
    }
}
