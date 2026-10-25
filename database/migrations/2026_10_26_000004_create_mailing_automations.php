<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('mailing_automations', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('event_key', 100)->nullable()->index();
            $table->string('subject', 255);
            $table->text('body');
            $table->boolean('is_enabled')->default(false);
            $table->timestamps();
        });
        DB::table('mailing_automations')->insert([
            'name' => 'Подтверждение email',
            'event_key' => 'email_verification',
            'subject' => 'Подтверди email — Познай СЕБЯ',
            'body' => "Привет, {name}!\n\nЧтобы подтвердить свой email, перейди по ссылке:\n{confirmation_link}\n\nЕсли ты не регистрировался, просто проигнорируй письмо.",
            'is_enabled' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
    public function down(): void { Schema::dropIfExists('mailing_automations'); }
};
