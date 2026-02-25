<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('seos', function (Blueprint $table) {
            $table->id(); // აუცილებელია
            $table->string('page')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('keywords')->nullable(); // რადგან array cast გაქვს
            $table->string('canonical')->nullable();
            $table->timestamps(); // აუცილებელია
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seos');
    }
};
