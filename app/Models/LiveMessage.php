<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LiveMessage extends Model {
    protected $fillable = ['live_session_id','live_guest_id','author_name','body','is_host','is_hidden','is_highlighted','ip_hash'];
    protected $casts = ['is_host' => 'boolean','is_hidden' => 'boolean','is_highlighted' => 'boolean'];
    public function session(): BelongsTo { return $this->belongsTo(LiveSession::class, 'live_session_id'); }
    public function guest(): BelongsTo { return $this->belongsTo(LiveGuest::class, 'live_guest_id'); }
}