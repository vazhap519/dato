<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('practices', function (Blueprint $table) {
            $table->boolean('free_enabled')->nullable()->default(true);
            $table->string('free_title')->nullable();
            $table->text('free_description')->nullable();
            $table->string('free_button_text')->nullable();
            $table->string('free_button_url', 2048)->nullable();
            $table->boolean('start_enabled')->nullable()->default(true);
            $table->string('start_badge')->nullable();
            $table->string('start_title')->nullable();
            $table->text('start_description')->nullable();
            $table->json('start_steps')->nullable();
            $table->string('start_note')->nullable();
            $table->string('start_button_text')->nullable();
            $table->string('start_button_url', 2048)->nullable();
        });
        Schema::table('footers', function (Blueprint $table) {
            $table->boolean('cta_enabled')->nullable()->default(true);
            $table->string('cta_badge')->nullable();
            $table->string('cta_title')->nullable();
            $table->text('cta_description')->nullable();
            $table->string('cta_button_text')->nullable();
            $table->string('cta_button_url', 2048)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('practices', fn (Blueprint $table) => $table->dropColumn([
            'free_enabled', 'free_title', 'free_description', 'free_button_text', 'free_button_url',
            'start_enabled', 'start_badge', 'start_title', 'start_description', 'start_steps',
            'start_note', 'start_button_text', 'start_button_url',
        ]));
        Schema::table('footers', fn (Blueprint $table) => $table->dropColumn([
            'cta_enabled', 'cta_badge', 'cta_title', 'cta_description', 'cta_button_text', 'cta_button_url',
        ]));
    }
};
