<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MailingDelivery extends Model
{
    protected $fillable = ['mailing_contact_id','type','practice_date','status','error','sent_at','mailing_automation_id'];
    protected $casts = ['practice_date'=>'date','sent_at'=>'datetime'];
    public function contact(): BelongsTo { return $this->belongsTo(MailingContact::class, 'mailing_contact_id'); }
}
