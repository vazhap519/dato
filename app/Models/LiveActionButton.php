<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LiveActionButton extends Model {
    protected $fillable = ['live_session_id', 'label', 'url', 'style', 'is_visible', 'sort_order'];
    protected $casts = ['is_visible' => 'boolean', 'sort_order' => 'integer'];
    public function session(): BelongsTo { return $this->belongsTo(LiveSession::class, 'live_session_id'); }
}
