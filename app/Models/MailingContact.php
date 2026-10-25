<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MailingContact extends Model
{
    protected $fillable = ['name','email','phone','source','practice_reminders','marketing_consent','consented_at','unsubscribed_at','unsubscribe_token'];
    protected $casts = ['practice_reminders'=>'boolean','marketing_consent'=>'boolean','consented_at'=>'datetime','unsubscribed_at'=>'datetime'];
    protected $hidden = ['unsubscribe_token'];
    public function deliveries(): HasMany { return $this->hasMany(MailingDelivery::class); }
}
