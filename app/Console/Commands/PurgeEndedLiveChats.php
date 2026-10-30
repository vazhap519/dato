<?php

namespace App\Console\Commands;

use App\Models\LiveSession;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PurgeEndedLiveChats extends Command
{
    protected $signature = 'live:purge-ended-chats {--apply : Delete chat history of already ended broadcasts}';
    protected $description = 'Clear messages and pinned messages from ended live sessions only.';

    public function handle(): int
    {
        $sessions = LiveSession::query()->where('status', 'ended')->pluck('id');
        $messages = DB::table('live_messages')->whereIn('live_session_id', $sessions)->count();
        $pins = LiveSession::query()->whereIn('id', $sessions)->whereNotNull('pinned_message_id')->count();

        if (! $this->option('apply')) {
            $this->info("Preview: {$sessions->count()} ended broadcasts, {$messages} messages, {$pins} pins.");
            $this->line('Run with --apply to permanently clear these ended-broadcast chats.');
            return self::SUCCESS;
        }

        DB::transaction(function () use ($sessions): void {
            DB::table('live_sessions')->whereIn('id', $sessions)->where('status', 'ended')->update(['pinned_message_id' => null]);
            DB::table('live_messages')->whereIn('live_session_id', $sessions)->delete();
        });

        $this->info("Cleared {$messages} messages and {$pins} pins from {$sessions->count()} ended broadcasts.");
        return self::SUCCESS;
    }
}
