<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailingAutomation extends Model
{
    protected $fillable = ['name','event_key','subject','body','is_enabled','trigger_event','delay_minutes','audience'];
    protected $casts = ['is_enabled' => 'boolean','delay_minutes' => 'integer'];
}
