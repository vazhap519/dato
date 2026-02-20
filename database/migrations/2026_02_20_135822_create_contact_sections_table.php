<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('contact_sections', function (Blueprint $table) {
            $table->id();

            $table->string('title'); // У тебя есть вопросы?
            $table->text('description')->nullable();

            $table->json('questions')->nullable(); 
            // ["Записать совместно подкаст?", "Пригласить на мероприятие?"]

            $table->string('button_text')->nullable();
$table->string('button_url')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_sections');
    }
};
