<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotFound extends Model
{
protected $fillable = [
    'not_found_title',
    'not_found_content',
'not_found_button_text',
];
}
