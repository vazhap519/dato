<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LiveSession extends Model {
    protected $fillable = ['live_series_id','day_number','title','description','youtube_url','status','chat_enabled','pinned_message_id'];
    protected $casts = ['chat_enabled' => 'boolean'];

    protected static function booted(): void {
        // Clear only this session's chat when the host marks the broadcast as ended.
        // Do not touch other days/sessions, action buttons, guests or bans.
        static::updated(function (self $session): void {
            if (! $session->wasChanged('status') || $session->status !== 'ended') {
                return;
            }

            $session->messages()->delete();
            $session->forceFill(['pinned_message_id' => null])->saveQuietly();
        });
    }
    public function series(): BelongsTo { return $this->belongsTo(LiveSeries::class, 'live_series_id'); }
    public function actionButtons(): HasMany { return $this->hasMany(LiveActionButton::class); }
    public function messages(): HasMany { return $this->hasMany(LiveMessage::class); }
}