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
            // 'navigation' => function () use ($request) {

            //     $routeName = $request->route()?->getName();

            //     $pageKey = match ($routeName) {
            //         'home'      => 'home',
            //         'personal'  => 'personal',
            //         'practice'  => 'practice',
            //         'legal'     => 'legal',
            //         'editoria'  => 'editoria',
            //         default     => 'home',
            //     };

            //     $page = \App\Models\LandingPage::where('key', $pageKey)
            //         ->with(['navigationItems' => function ($q) {
            //             $q->where('is_active', true)
            //                 ->orderBy('sort');
            //         }])
            //         ->first();

            //     return $page
            //         ? $page->navigationItems->map(fn ($i) => [
            //             'id'    => $i->id,
            //             'label' => $i->label,
            //             'href'  => ltrim($i->href, '#'),
            //         ])->values()
            //         : [];
            // },




            'navigation' => function () use ($request) {

    $routeName = $request->route()?->getName();

    $page = \App\Models\LandingPage::where('key', $routeName)
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
            'headerNavigation' => function () {
                $pages = LandingPage::with(['navigationItems' => function ($query) {
                    $query->where('is_active', true)->orderBy('sort');
                }])->orderBy('id')->get();

                return $pages->flatMap(function ($page) {
                    if ($page->key === 'closed-group.show') {
                        $slug = \App\Models\ClosedGroup::query()->whereNotNull('slug')->value('slug');

                        if (! $slug) {
                            return collect();
                        }

                        $path = route('closed-group.show', ['slug' => $slug], false);
                    } elseif (in_array($page->key, ['home', 'personal', 'practice', 'legal', 'editoria'], true)) {
                        $path = route($page->key, [], false);
                    } else {
                        return collect();
                    }

                    return $page->navigationItems->map(fn ($item) => [
                        'id' => $item->id,
                        'label' => $item->label,
                        'href' => $path . '#' . ltrim($item->href, '#'),
                    ]);
                })->values();
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

                $seo = cache()->rememberForever("seo_{$routeName}", function () use ($routeName) {
                    $record = Seo::where('page', $routeName)->first();
                    if (! $record) return null;

                    return [
                        'title' => $record->title,
                        'description' => $record->description,
                        'keywords' => is_array($record->keywords) ? implode(', ', $record->keywords) : $record->keywords,
                        'image' => $record->seo_image_url,
                        'canonical' => $record->canonical,
                    ];
                });

                if (! $seo) return null;

                // Dynamic URLs must not inherit a canonical from a different group slug.
                if ($routeName === 'closed-group.show') {
                    $seo['canonical'] = $request->url();
                } else {
                    $seo['canonical'] = $seo['canonical'] ?: $request->url();
                }

                return $seo;
            },

            'settings' => function () {

                return cache()->rememberForever('site_settings', function () {
                    $settings = \App\Models\SiteSetting::first();

                    if (! $settings) return null;

                    return [
                        'site_name' => $settings->site_name,
                        'numbers_light_theme_enabled' => (bool) $settings->numbers_light_theme_enabled,
                        'favicon' => $settings->favicon_url,
                        'apple_icon' => $settings->apple_icon_url,
                        'og_default' => $settings->og_default_url,
                        'logo' => $settings->logo_url,
                    ];
                });
            },
'not_found'=>NotFound::first()
        ];
    }
}
