<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetAdminLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        app()->setLocale('ru');
        config(['app.fallback_locale' => 'ru']);

        return $next($request);
    }
}
