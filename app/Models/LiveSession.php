<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LiveSession extends Model {
    protected $fillable = ['live_series_id','day_number','title','description','youtube_url','status','chat_enabled','pinned_message_id'];
    protected $casts = ['chat_enabled' => 'boolean'];
    public function series(): BelongsTo { return $this->belongsTo(LiveSeries::class, 'live_series_id'); }
    public function messages(): HasMany { return $this->hasMany(LiveMessage::class); }
}