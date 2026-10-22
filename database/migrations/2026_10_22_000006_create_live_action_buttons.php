<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('live_action_buttons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('live_session_id')->constrained('live_sessions')->cascadeOnDelete();
            $table->string('label', 90);
            $table->string('url', 2048);
            $table->string('style', 16)->default('gold');
            $table->boolean('is_visible')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->index(['live_session_id', 'is_visible', 'sort_order']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('live_action_buttons');
    }
};
