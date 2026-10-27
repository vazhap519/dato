<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('site_analytics_events', function (Blueprint $table) {
            $table->id();
            $table->uuid('visitor_id');
            $table->uuid('session_id');
            $table->string('event', 40);
            $table->string('path', 500);
            $table->string('element', 120)->nullable();
            $table->string('referrer_host', 255)->nullable();
            $table->string('utm_source', 120)->nullable();
            $table->string('utm_medium', 120)->nullable();
            $table->string('utm_campaign', 120)->nullable();
            $table->string('device', 20)->nullable();
            $table->string('browser', 30)->nullable();
            $table->string('ip_hash', 64)->nullable();
            $table->timestamp('occurred_at')->useCurrent();
            $table->index(['occurred_at', 'event']);
            $table->index(['path', 'occurred_at']);
            $table->index(['visitor_id', 'occurred_at']);
        });
    }
    public function down(): void { Schema::dropIfExists('site_analytics_events'); }
};
