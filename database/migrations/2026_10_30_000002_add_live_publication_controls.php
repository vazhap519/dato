<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('live_sessions', function (Blueprint $table) {
            $table->boolean('is_published')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('tab_label', 120)->nullable();
            $table->string('chat_title', 120)->nullable();
            $table->string('video_placeholder', 255)->nullable();
            $table->string('chat_empty_text', 255)->nullable();
            $table->boolean('show_video')->default(true);
            $table->boolean('show_chat')->default(true);
        });
        // Preserve the former public behavior of every existing broadcast.
        // New broadcasts are created hidden until explicitly published.
        DB::table('live_sessions')->update(['is_published' => true]);
    }

    public function down(): void {
        Schema::table('live_sessions', function (Blueprint $table) {
            $table->dropColumn([
                'is_published', 'sort_order', 'tab_label', 'chat_title',
                'video_placeholder', 'chat_empty_text', 'show_video', 'show_chat',
            ]);
        });
    }
};
