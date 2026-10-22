<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class LiveIpBan extends Model {
 protected $fillable = ['ip_hash','expires_at','reason'];
 protected $casts = ['expires_at'=>'datetime'];
}
