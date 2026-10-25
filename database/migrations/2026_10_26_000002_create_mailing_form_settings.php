<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('mailing_form_settings', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('Напоминание о практикуме');
            $table->text('description')->default('Оставь контакты, чтобы получать напоминания перед началом. После регистрации откроется Telegram.');
            $table->string('name_label')->default('Имя');
            $table->string('email_label')->default('Email');
            $table->string('phone_label')->default('Телефон (необязательно)');
            $table->string('reminders_label')->default('Согласен получать письма-напоминания о практикуме.');
            $table->string('marketing_label')->default('Хочу также получать новости о книгах, эфирах и проектах (необязательно).');
            $table->string('button_text')->default('Продолжить в Telegram');
            $table->string('success_text')->default('Регистрация сохранена. Открываем Telegram…');
            $table->text('telegram_url')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('mailing_form_settings'); }
};
