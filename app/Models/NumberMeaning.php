<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class NumberMeaning extends Model {
    protected $fillable = ['number','title','symbolism','light_side','shadow_side','reflection_question','practice','is_published'];
    protected $casts = ['is_published'=>'boolean'];
}
