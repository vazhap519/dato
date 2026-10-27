<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LegalDocument extends Model
{
    protected $fillable = ['slug', 'title', 'content', 'version', 'effective_at', 'is_published'];
    public function versions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(LegalDocumentVersion::class);
    }

    protected $casts = ['effective_at' => 'date', 'is_published' => 'boolean'];
}
