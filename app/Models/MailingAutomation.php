<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailingAutomation extends Model
{
    protected $fillable = ['name','event_key','subject','body','is_enabled'];
    protected $casts = ['is_enabled' => 'boolean'];
}
