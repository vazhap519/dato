<?php

namespace App\Support;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class FrontendRoutes
{
    public static function get(): array
    {
        return Cache::remember('frontend_routes', 3600, function () {
            return collect(Route::getRoutes())
                ->filter(function ($route) {
                    $name = $route->getName();

                    if (!$name) return false;

                    if (
                        Str::contains($name, ['filament', 'livewire', 'debugbar']) ||
                        Str::startsWith($name, ['ignition.', '_'])
                    ) {
                        return false;
                    }

                    if (!in_array('GET', $route->methods())) {
                        return false;
                    }

                    return true;
                })
                ->mapWithKeys(fn ($route) => [
                    $route->getName() => self::formatLabel($route->getName())
                ])
                ->sortKeys()
                ->toArray();
        });
    }

    protected static function formatLabel(string $name): string
    {
        return Str::of($name)
            ->replace('.', ' ')
            ->replace('-', ' ')
            ->title();
    }
}