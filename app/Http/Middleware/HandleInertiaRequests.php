<?php

namespace App\Http\Middleware;

use App\Models\LandingPage;
use App\Models\NotFound;
use Illuminate\Http\Request;
use Inertia\Middleware;
use  \App\Models\Navigation;
use App\Models\Footer;
use App\Models\Review;
use App\Models\Practice;
class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            /*
      |--------------------------------------------------------------------------
      | Dynamic Navigation per page
      |--------------------------------------------------------------------------
      */
            'navigation' => function () use ($request) {

                $routeName = $request->route()?->getName();

                $pageKey = match ($routeName) {
                    'home' => 'home',
                    'shop' => 'shop',
                    'joint-path' => 'joint-path',
                    'consultation' => 'consultation',
                    default => 'home',
                };

                $page = \App\Models\LandingPage::where('key', $pageKey)
                    ->with(['navigationItems' => function ($q) {
                        $q->where('is_active', true)->orderBy('sort');
                    }])
                    ->first();

                return $page
                    ? $page->navigationItems->map(fn ($i) => [
                        'id' => $i->id,
                        'label' => $i->label,
                        'href' => ltrim($i->href, '#'),

                    ])->values()
                    : [];
            },
            'not_found'=>fn()=>NotFound::first(),

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

           
'review' => function () {
    $review = Review::first();

    return $review ? [
        'review_sm_header' => $review->review_sm_header,
        'review_xl_header' => $review->review_xl_header,
        'content' => $review->content ?? [],
    ] : null;
},
'contactSection' => function () {
    $section = \App\Models\ContactSection::first();

    return $section ? [
        'title' => $section->title,
        'description' => $section->description,
        'questions' => $section->questions ?? [],
        'button_text' => $section->button_text,
        'button_url' => $section->button_url,
        'image' => $section->contactImageUrl(),
    ] : null;
},
'practiceSection' => function () {

    $section = Practice::first();

    return $section ? [
        'header_big'   => $section->header_big,
        'header_small' => $section->header_small,
        'content'      => $section->content ?? [],
    ] : null;
},
        ];


    }
}
