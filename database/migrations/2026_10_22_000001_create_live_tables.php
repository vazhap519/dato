<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('live_series', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->timestamps();
        });
        Schema::create('live_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('live_series_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('day_number');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('status')->default('scheduled');
            $table->boolean('chat_enabled')->default(true);
            $table->timestamps();
            $table->unique(['live_series_id', 'day_number']);
        });
        Schema::create('live_guests', function (Blueprint $table) {
            $table->id();
            $table->uuid('token')->unique();
            $table->string('name', 60);
            $table->boolean('is_banned')->default(false);
            $table->timestamps();
        });
        Schema::create('live_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('live_session_id')->constrained()->cascadeOnDelete();
            $table->foreignId('live_guest_id')->nullable()->constrained()->nullOnDelete();
            $table->string('author_name', 60);
            $table->text('body');
            $table->boolean('is_host')->default(false);
            $table->boolean('is_hidden')->default(false);
            $table->timestamps();
            $table->index(['live_session_id', 'id']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('live_messages');
        Schema::dropIfExists('live_guests');
        Schema::dropIfExists('live_sessions');
        Schema::dropIfExists('live_series');
    }
};