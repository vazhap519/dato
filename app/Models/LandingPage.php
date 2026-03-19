<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Support\FrontendRoutes;

class LandingPage extends Model
{
    protected $fillable = [
        'key',
    ];

    public function navigationItems(): HasMany
    {
        return $this->hasMany(NavigationItem::class)->orderBy('sort');
    }

    /**
     * UI label (დინამიურად მოდის routes-დან)
     */
    public function getLabelAttribute(): string
    {
        return FrontendRoutes::get()[$this->key] ?? ucfirst($this->key);
    }
}