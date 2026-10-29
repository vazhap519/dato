<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('self_discovery_tools', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->string('icon', 60)->default('auto_awesome');
            $table->string('url', 2048)->nullable();
            $table->unsignedInteger('sort')->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('self_discovery_tools'); }
};
