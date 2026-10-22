<?php

namespace App\Http\Controllers;

use App\Models\LiveModerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;

class LiveModeratorAuthController extends Controller {
    public function show(Request $request, string $token) {
        $moderator = LiveModerator::where('access_token_hash', hash('sha256', $token))->where('is_active', true)->firstOrFail();
        return response()->view('live-moderator-login', ['token' => $token, 'login' => $moderator->login]);
    }

    public function login(Request $request, string $token) {
        $data = $request->validate(['login' => ['required', 'string'], 'password' => ['required', 'string']]);
        $key = 'live-mod-login:'.hash('sha256', $request->ip().'|'.$token.'|'.$data['login']);
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return back()->withErrors(['login' => 'Слишком много попыток. Повторите позже.']);
        }
        $moderator = LiveModerator::where('access_token_hash', hash('sha256', $token))->where('is_active', true)->first();
        if (!$moderator || !hash_equals($moderator->login, $data['login']) || !Hash::check($data['password'], $moderator->password)) {
            RateLimiter::hit($key, 300);
            return back()->withErrors(['login' => 'Неверные данные для входа.']);
        }
        RateLimiter::clear($key);
        $request->session()->regenerate();
        $request->session()->put('live_moderator_id', $moderator->id);
        $request->session()->put('live_moderator_token_hash', $moderator->access_token_hash);
        return redirect('/live');
    }

    public function logout(Request $request) {
        $request->session()->forget(['live_moderator_id', 'live_moderator_token_hash']);
        $request->session()->regenerateToken();
        return redirect('/live');
    }
}
