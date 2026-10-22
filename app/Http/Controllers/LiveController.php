<?php

namespace App\Http\Controllers;

use App\Models\LiveActionButton;
use App\Models\LiveModerator;
use App\Models\LiveGuest;
use App\Models\LiveIpBan;
use App\Models\LiveMessage;
use App\Models\LiveSession;
use Filament\Facades\Filament;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LiveController extends Controller {
    private function liveModerator(Request $request): ?LiveModerator {
        $id = $request->session()->get('live_moderator_id');
        return $id ? LiveModerator::whereKey($id)->where('is_active', true)
            ->where('access_token_hash', $request->session()->get('live_moderator_token_hash'))->first() : null;
    }

    private function admin(Request $request): bool {
        $user = $request->user();
        return $user !== null && $user->canAccessPanel(Filament::getPanel('admin'));
    }

    private function moderator(Request $request): bool {
        return $this->admin($request) || $this->liveModerator($request) !== null;
    }

    private function allowed(Request $request, string $permission): bool {
        return $this->admin($request) || ($this->liveModerator($request)?->hasPermission($permission) ?? false);
    }

    private function permissions(Request $request): array {
        return $this->admin($request) ? array_keys(LiveModerator::PERMISSIONS) : ($this->liveModerator($request)?->permissions ?? []);
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
            'moderatorPermissions' => $this->permissions($request),
            'isLiveModerator' => $this->liveModerator($request) !== null && !$this->admin($request),
        ]);
    }

    public function session(Request $request, LiveSession $session) {
        return response()->json([
            'id' => $session->id, 'title' => $session->title, 'description' => $session->description,
            'status' => $session->status, 'chat_enabled' => $session->chat_enabled,
            'youtube_id' => $this->youtubeId($session->youtube_url),
            'action_buttons' => LiveActionButton::query()->where('live_session_id', $session->id)
                ->when(! $this->allowed($request, 'buttons'), fn ($query) => $query->where('is_visible', true))
                ->orderBy('sort_order')->orderBy('id')
                ->get(['id', 'label', 'url', 'style', 'is_visible', 'sort_order']),
            'pinned_message' => $session->pinned_message_id ? LiveMessage::query()
                ->whereKey($session->pinned_message_id)->where('is_hidden', false)
                ->first(['id','author_name','body','is_host','is_highlighted']) : null,
        ]);
    }

    private function validatedButton(Request $request): array {
        $data = $request->validate([
            'label' => ['required', 'string', 'min:1', 'max:90'],
            'url' => ['required', 'string', 'max:2048'],
            'style' => ['required', 'in:gold,outline'],
            'is_visible' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:10000'],
        ]);
        $data['label'] = trim(strip_tags($data['label']));
        abort_if($data['label'] === '', 422, 'Введите название кнопки.');
        $url = $data['url'];
        $scheme = strtolower(parse_url($url, PHP_URL_SCHEME) ?: '');
        $host = strtolower(parse_url($url, PHP_URL_HOST) ?: '');
        $isWeb = in_array($scheme, ['http', 'https'], true) && filter_var($url, FILTER_VALIDATE_URL) && $host !== '';
        $isTelegram = $scheme === 'tg' && $host === 'resolve'
            && preg_match('/^tg:\/\/resolve\?[a-zA-Z0-9_=&%.-]+$/', $url);
        if ($isTelegram) {
            parse_str(parse_url($url, PHP_URL_QUERY) ?: '', $params);
            $isTelegram = isset($params['domain'])
                && preg_match('/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/', $params['domain'])
                && (!isset($params['appname']) || preg_match('/^[a-zA-Z][a-zA-Z0-9_]{0,63}$/', $params['appname']))
                && (!isset($params['startapp']) || preg_match('/^[a-zA-Z0-9_-]{1,128}$/', $params['startapp']));
        }
        abort_unless(($isWeb || $isTelegram) && ! parse_url($url, PHP_URL_USER) && ! parse_url($url, PHP_URL_PASS), 422, 'Допустимы ссылки https:// или Telegram tg://resolve.');

        return $data;
    }

    public function createButton(Request $request, LiveSession $session) {
        abort_unless($this->allowed($request, 'buttons'), 403);
        abort_if(LiveActionButton::where('live_session_id', $session->id)->count() >= 12, 422, 'Максимум 12 кнопок для одного эфира.');
        $button = $session->actionButtons()->create($this->validatedButton($request));
        return response()->json($button, 201);
    }

    public function updateButton(Request $request, LiveSession $session, LiveActionButton $button) {
        abort_unless($this->allowed($request, 'buttons'), 403);
        abort_unless($button->live_session_id === $session->id, 404);
        $button->update($this->validatedButton($request));
        return response()->json($button->fresh());
    }

    public function deleteButton(Request $request, LiveSession $session, LiveActionButton $button) {
        abort_unless($this->allowed($request, 'buttons'), 403);
        abort_unless($button->live_session_id === $session->id, 404);
        $button->delete();
        return response()->json(['ok' => true]);
    }

    public function presence(Request $request, LiveSession $session) {
        $token = hash_hmac('sha256', $request->session()->getId(), config('app.key'));
        DB::table('live_presence')->upsert([[
            'live_session_id' => $session->id,
            'visitor_token' => $token,
            'last_seen_at' => now(),
        ]], ['live_session_id', 'visitor_token'], ['last_seen_at']);
        $count = DB::table('live_presence')->where('live_session_id', $session->id)
            ->where('last_seen_at', '>=', now()->subSeconds(45))->count();
        return response()->json(['online' => $count]);
    }

    public function hostSend(Request $request, LiveSession $session) {
        abort_unless($this->allowed($request, 'host'), 403);
        $data = $request->validate(['body' => ['required', 'string', 'max:500']]);
        $body = trim(strip_tags($data['body']));
        abort_if($body === '', 422, 'Введите текст сообщения.');
        $message = LiveMessage::create([
            'live_session_id' => $session->id,
            'author_name' => 'Давид',
            'body' => $body,
            'is_host' => true,
        ]);
        return response()->json($message->only(['id','author_name','body','is_host','created_at']), 201);
    }

    public function chatControl(Request $request, LiveSession $session) {
        abort_unless($this->allowed($request, 'chat'), 403);
        $data = $request->validate(['chat_enabled' => ['required', 'boolean']]);
        $session->update(['chat_enabled' => $data['chat_enabled']]);
        return response()->json(['chat_enabled' => $session->chat_enabled]);
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
        $fields = ['id','author_name','body','is_host','is_highlighted','created_at'];
        if ($moderator) $fields = array_merge($fields, ['is_hidden']);
        if ($this->allowed($request, 'ban')) $fields = array_merge($fields, ['ip_hash','live_guest_id']);
        return response()->json($query->latest('id')->limit(100)->get($fields)->reverse()->values());
    }

    public function moderate(Request $request, LiveSession $session, LiveMessage $message) {
        abort_unless($this->moderator($request), 403);
        abort_unless($message->live_session_id === $session->id, 404);
        $data = $request->validate(['action' => ['required', 'in:hide,show,ban_ip,ban_guest,pin,unpin,highlight,unhighlight']]);
        $required = match ($data['action']) {
            'hide', 'show' => 'messages',
            'ban_ip', 'ban_guest' => 'ban',
            'pin', 'unpin' => 'pin',
            'highlight', 'unhighlight' => 'highlight',
        };
        abort_unless($this->allowed($request, $required), 403);
        if ($data['action'] === 'hide') {
            $message->update(['is_hidden' => true]);
            if ($session->pinned_message_id === $message->id) $session->update(['pinned_message_id' => null]);
        }
        if ($data['action'] === 'show') $message->update(['is_hidden' => false]);
        if ($data['action'] === 'pin') {
            abort_if($message->is_hidden, 422, 'Скрытое сообщение нельзя закрепить.');
            $session->update(['pinned_message_id' => $message->id]);
        }
        if ($data['action'] === 'unpin' && $session->pinned_message_id === $message->id) $session->update(['pinned_message_id' => null]);
        if ($data['action'] === 'highlight') $message->update(['is_highlighted' => true]);
        if ($data['action'] === 'unhighlight') $message->update(['is_highlighted' => false]);
        if ($data['action'] === 'ban_guest') {
            abort_unless($message->guest, 422, 'Гость для этого сообщения неизвестен.');
            $message->guest->update(['is_banned' => true]);
            $message->update(['is_hidden' => true]);
            if ($session->pinned_message_id === $message->id) $session->update(['pinned_message_id' => null]);
        }
        if ($data['action'] === 'ban_ip') {
            abort_unless($message->ip_hash, 422, 'IP для этого сообщения неизвестен.');
            LiveIpBan::updateOrCreate(
                ['ip_hash' => $message->ip_hash],
                ['expires_at' => now()->addDay(), 'reason' => 'Модерация чата']
            );
            $message->update(['is_hidden' => true]);
            if ($session->pinned_message_id === $message->id) $session->update(['pinned_message_id' => null]);
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