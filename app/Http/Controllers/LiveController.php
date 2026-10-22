<?php

namespace App\Http\Controllers;

use App\Models\LiveGuest;
use App\Models\LiveIpBan;
use App\Models\LiveMessage;
use App\Models\LiveSession;
use Filament\Facades\Filament;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LiveController extends Controller {
    private function moderator(Request $request): bool {
        $user = $request->user();
        return $user !== null && $user->canAccessPanel(Filament::getPanel('admin'));
    }

    public function index(Request $request) {
        $sessions = LiveSession::with('series:id,title')->orderByDesc('live_series_id')->orderBy('day_number')->get();
        $active = $sessions->firstWhere('status', 'live') ?? $sessions->firstWhere('status', 'scheduled') ?? $sessions->first();
        return Inertia::render('Live', [
            'sessions' => $sessions->map(fn ($s) => [
                'id' => $s->id, 'day' => $s->day_number, 'title' => $s->title,
                'series' => $s->series?->title, 'status' => $s->status,
            ]),
            'initialSessionId' => $active?->id,
            'canModerate' => $this->moderator($request),
        ]);
    }

    public function session(LiveSession $session) {
        return response()->json([
            'id' => $session->id, 'title' => $session->title, 'description' => $session->description,
            'status' => $session->status, 'chat_enabled' => $session->chat_enabled,
            'youtube_id' => $this->youtubeId($session->youtube_url),
        ]);
    }

    private function youtubeId(?string $url): ?string {
        if (! $url) return null;
        $host = strtolower(parse_url($url, PHP_URL_HOST) ?: '');
        $path = trim(parse_url($url, PHP_URL_PATH) ?: '', '/');
        if (in_array($host, ['youtu.be', 'www.youtu.be'], true)) $id = explode('/', $path)[0];
        elseif (in_array($host, ['youtube.com','www.youtube.com','m.youtube.com'], true)) {
            if (str_starts_with($path, 'live/') || str_starts_with($path, 'embed/')) $id = explode('/', $path)[1] ?? '';
            else { parse_str(parse_url($url, PHP_URL_QUERY) ?: '', $params); $id = $params['v'] ?? ''; }
        } else return null;
        return preg_match('/^[a-zA-Z0-9_-]{11}$/', $id) ? $id : null;
    }

    private function ipHash(Request $request): string {
        return hash_hmac('sha256', $request->ip(), config('app.key'));
    }

    private function assertIpAllowed(Request $request): void {
        $blocked = LiveIpBan::where('ip_hash', $this->ipHash($request))
            ->where(function ($query) { $query->whereNull('expires_at')->orWhere('expires_at', '>', now()); })
            ->exists();
        abort_if($blocked, 403, 'Доступ к чату заблокирован модератором.');
    }

    public function join(Request $request) {
        $this->assertIpAllowed($request);
        $data = $request->validate(['name' => ['required','string','min:2','max:40']]);
        $guest = LiveGuest::create(['name' => trim(strip_tags($data['name'])), 'token' => (string) Str::uuid()]);
        $request->session()->put('live_guest_id', $guest->id);
        return response()->json(['name' => $guest->name]);
    }

    public function guest(Request $request) {
        $guest = LiveGuest::find($request->session()->get('live_guest_id'));
        return response()->json(['name' => $guest && ! $guest->is_banned ? $guest->name : null]);
    }

    public function messages(Request $request, LiveSession $session) {
        $moderator = $this->moderator($request);
        $query = $session->messages();
        if (! $moderator) $query->where('is_hidden', false);
        $fields = ['id','author_name','body','is_host','created_at'];
        if ($moderator) $fields = array_merge($fields, ['is_hidden','ip_hash']);
        return response()->json($query->latest('id')->limit(100)->get($fields)->reverse()->values());
    }

    public function moderate(Request $request, LiveSession $session, LiveMessage $message) {
        abort_unless($this->moderator($request), 403);
        abort_unless($message->live_session_id === $session->id, 404);
        $data = $request->validate(['action' => ['required', 'in:hide,show,ban_ip']]);
        if ($data['action'] === 'hide') $message->update(['is_hidden' => true]);
        if ($data['action'] === 'show') $message->update(['is_hidden' => false]);
        if ($data['action'] === 'ban_ip') {
            abort_unless($message->ip_hash, 422, 'IP для этого сообщения неизвестен.');
            LiveIpBan::updateOrCreate(
                ['ip_hash' => $message->ip_hash],
                ['expires_at' => now()->addDay(), 'reason' => 'Модерация чата']
            );
            $message->update(['is_hidden' => true]);
        }
        return response()->json(['ok' => true]);
    }

    public function send(Request $request, LiveSession $session) {
        $this->assertIpAllowed($request);
        $guest = LiveGuest::find($request->session()->get('live_guest_id'));
        abort_unless($guest && ! $guest->is_banned, 403, 'Войди в чат, чтобы отправлять сообщения.');
        abort_unless($session->status === 'live' && $session->chat_enabled, 403, 'Чат сейчас закрыт.');
        $data = $request->validate(['body' => ['required','string','max:500']]);
        $message = LiveMessage::create([
            'live_session_id' => $session->id, 'live_guest_id' => $guest->id,
            'author_name' => $guest->name, 'body' => trim(strip_tags($data['body'])),
            'ip_hash' => $this->ipHash($request),
        ]);
        return response()->json($message->only(['id','author_name','body','is_host','created_at']), 201);
    }
}