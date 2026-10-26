<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailingFormSetting extends Model
{
    protected $casts = ['auto_reminders_enabled' => 'boolean', 'registration_form_enabled' => 'boolean'];
    protected $fillable = ['title','description','name_label','email_label','phone_label','reminders_label','marketing_label','button_text','success_text','telegram_url','auto_reminders_enabled','registration_form_enabled'];
}
