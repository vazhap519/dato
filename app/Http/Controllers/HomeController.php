<?php

namespace App\Http\Controllers;

use App\Models\HomeAboutSection;
use App\Models\HomeHero;
use App\Models\Shop;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function home()
    {
        $hero = HomeHero::where('is_active', true)->first();
        $about = HomeAboutSection::where('is_active', true)->first();
$shop = Shop::where('is_active', true)->first();
        return Inertia::render('Home', [
            'hero' => $hero ? [
                ...$hero->toArray(),
                'hero_image_url' => $hero->heroImageUrl(),
            ] : null,

            'about' => $about ? [
                ...$about->toArray(),
                'about_image_url' => $about->aboutImageUrl(),
            ] : null,

            'shop' => $shop ? $shop->toArray() : null, // ან უბრალოდ $shop
        ]);
    }

}
