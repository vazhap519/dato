<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('editorias', function (Blueprint $table) {
            $table->id();

            // HERO
            $table->string('hero_badge')->nullable();
            $table->string('hero_title')->nullable();
            $table->text('hero_description')->nullable();
            $table->string('hero_button_text')->nullable();
            $table->string('hero_button_url')->nullable();

            // QUOTE
            $table->text('quote_text')->nullable();
            $table->string('quote_button_text')->nullable();

            // INFO STRIP
            $table->json('info_blocks')->nullable();

            // PROGRAM DAYS
            $table->json('program_days')->nullable();

            // FOR WHOM
            $table->string('for_whom_title')->nullable();
            $table->text('for_whom_description')->nullable();
            $table->json('for_whom_list')->nullable();

            // WHY SECTION
            $table->string('why_title')->nullable();
            $table->text('why_description')->nullable();
            $table->string('why_button_text')->nullable();

            // AUTHOR
            $table->string('author_name')->nullable();
            $table->text('author_quote')->nullable();
            $table->json('author_points')->nullable();
            $table->string('author_button_text')->nullable();

            // FINAL CTA
            $table->string('cta_title')->nullable();
            $table->text('cta_description')->nullable();
            $table->string('cta_button_text')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('editorias');
    }
};
