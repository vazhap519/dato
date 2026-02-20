<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    // აქ რაც უკვე გაქვს dontReport/dontFlash/register — დატოვე.

    public function render($request, Throwable $exception)
    {
        if (
            $exception instanceof ModelNotFoundException ||
            $exception instanceof NotFoundHttpException
        ) {
            // ✅ Inertia navigation request (Link / visit)
            if ($request->header('X-Inertia')) {
                return Inertia::render('Error/NotFound')
                    ->toResponse($request)
                    ->setStatusCode(404);
            }

            // ✅ Direct URL / refresh (non-inertia request)
            // Option A: also show inertia (works fine for full page loads)
            return Inertia::render('Error/NotFound')
                ->toResponse($request)
                ->setStatusCode(404);

            // Option B: Blade fallback (თუ გინდა blade)
            // return response()->view('errors.404', [], 404);
        }

        return parent::render($request, $exception);
    }
}
