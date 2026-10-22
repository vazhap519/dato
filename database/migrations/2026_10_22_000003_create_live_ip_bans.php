<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('live_ip_bans', function (Blueprint $table) {
            $table->id();
            $table->string('ip_hash', 64)->unique();
            $table->timestamp('expires_at')->nullable();
            $table->string('reason')->nullable();
            $table->timestamps();
        });
        Schema::table('live_messages', function (Blueprint $table) {
            $table->string('ip_hash', 64)->nullable()->index();
        });
    }
    public function down(): void {
        Schema::table('live_messages', function (Blueprint $table) { $table->dropColumn('ip_hash'); });
        Schema::dropIfExists('live_ip_bans');
    }
};
