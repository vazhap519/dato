<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SelfDiscoveryTool extends Model
{
    protected $fillable = ['slug','title','subtitle','description','icon','url','sort','is_published'];
    protected $casts = ['is_published' => 'boolean', 'sort' => 'integer'];
}
