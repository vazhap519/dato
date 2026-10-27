<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('number_meanings', function (Blueprint $table) {
            $table->id();
            $table->string('number', 12)->unique();
            $table->string('title');
            $table->text('symbolism');
            $table->text('light_side')->nullable();
            $table->text('shadow_side')->nullable();
            $table->text('reflection_question')->nullable();
            $table->text('practice')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('number_meanings'); }
};
