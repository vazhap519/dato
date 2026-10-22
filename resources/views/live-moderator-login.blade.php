<!doctype html>
<html lang="ru">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="csrf-token" content="{{ csrf_token() }}"><title>Вход модератора</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#17140e;color:#fff;font-family:system-ui,sans-serif}main{width:min(390px,90vw);padding:30px;background:#221e17;border:1px solid #6b5625;border-radius:18px}h1{color:#f5c542;font-size:24px}label{display:block;margin-top:18px}input{box-sizing:border-box;width:100%;padding:12px;margin-top:7px;background:#17140e;color:white;border:1px solid #777;border-radius:8px}button{width:100%;margin-top:24px;padding:13px;background:#f5c542;border:0;border-radius:8px;font-weight:700;cursor:pointer}.error{color:#ff9b9b}</style></head>
<body><main><h1>Вход модератора</h1><p>Введите выданные администратором данные.</p>
@if($errors->any())<p class="error">{{ $errors->first() }}</p>@endif
<form method="POST" action="{{ route('live.moderator.login', ['token' => $token]) }}">@csrf
<label for="login">Логин</label><input id="login" name="login" value="{{ old('login', $login) }}" autocomplete="username" required>
<label for="password">Пароль</label><input id="password" type="password" name="password" autocomplete="current-password" required>
<button type="submit">Войти в эфир</button></form></main></body></html>
