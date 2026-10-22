<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('live_presence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('live_session_id')->constrained('live_sessions')->cascadeOnDelete();
            $table->string('visitor_token', 64);
            $table->timestamp('last_seen_at')->index();
            $table->unique(['live_session_id', 'visitor_token']);
        });
    }
    public function down(): void { Schema::dropIfExists('live_presence'); }
};
