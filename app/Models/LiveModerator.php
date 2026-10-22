<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class LiveModerator extends Model {
    public const PERMISSIONS = [
        'messages' => 'Удаление и восстановление сообщений',
        'ban' => 'Блокировка участников',
        'pin' => 'Закрепление сообщений',
        'highlight' => 'Подсветка сообщений',
        'chat' => 'Открытие и закрытие чата',
        'host' => 'Сообщения ведущего',
        'buttons' => 'Управление кнопками',
    ];

    protected $fillable = ['login', 'password', 'access_token_hash', 'access_token_encrypted', 'permissions', 'is_active'];
    protected $hidden = ['password', 'access_token_hash', 'access_token_encrypted'];
    protected function casts(): array { return ['password' => 'hashed', 'access_token_encrypted' => 'encrypted', 'permissions' => 'array', 'is_active' => 'boolean']; }

    public static function newToken(): string { return Str::random(64); }
    public function hasPermission(string $permission): bool { return $this->is_active && in_array($permission, $this->permissions ?? [], true); }
}
