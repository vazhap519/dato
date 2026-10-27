<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LegalDocumentVersion extends Model
{
    public $timestamps = false;
    protected $fillable = ['title', 'content', 'version', 'effective_at', 'archived_at'];
    protected $casts = ['effective_at' => 'date', 'archived_at' => 'datetime'];
}
