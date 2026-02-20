<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LandingPage extends Model
{
    protected $fillable = [
        'key',
    ];

    public function navigationItems(): HasMany
    {
        return $this->hasMany(NavigationItem::class)->orderBy('sort');
    }

    // UI helper (არ ინახება DB-ში)
    public function getLabelAttribute(): string
    {
        return match ($this->key) {
            'home' => 'Home',
            'shop' => 'Shop (List in blocks)',
            'joint-path' => 'Joint path (Telegram group)',
            'consultation' => 'Individual consultation',
            default => $this->key,
        };
    }
}
