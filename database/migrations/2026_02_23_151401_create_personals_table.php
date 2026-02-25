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

        Schema::create('personals', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | HERO SECTION
            |--------------------------------------------------------------------------
            */

            $table->string('hero_badge')->nullable();
            $table->string('hero_title_line_1')->nullable();
            $table->string('hero_title_highlight')->nullable();
            $table->string('hero_title_line_2')->nullable();
            $table->text('hero_description')->nullable();

            $table->string('hero_primary_button_text')->nullable();
            $table->string('hero_primary_button_url')->nullable();
            $table->string('hero_secondary_button_text')->nullable();
            $table->string('hero_secondary_button_url')->nullable();

            $table->string('hero_author_name')->nullable();
            $table->string('hero_author_role')->nullable();

            /*
            |--------------------------------------------------------------------------
            | HOW SECTION
            |--------------------------------------------------------------------------
            */

            $table->string('how_title_line_1')->nullable();
            $table->string('how_title_highlight')->nullable();
            $table->text('how_description')->nullable();
            $table->json('how_items')->nullable();

            /*
            |--------------------------------------------------------------------------
            | STEPS SECTION
            |--------------------------------------------------------------------------
            */

            $table->string('steps_title')->nullable();
            $table->string('steps_subtitle')->nullable();
            $table->json('steps_items')->nullable();

            /*
            |--------------------------------------------------------------------------
            | PRICING SECTION
            |--------------------------------------------------------------------------
            */

            $table->string('pricing_title')->nullable();
            $table->string('pricing_amount')->nullable();
            $table->string('pricing_currency')->nullable();
            $table->json('pricing_features')->nullable();
            $table->string('pricing_button_text')->nullable();
            $table->string('pricing_button_url')->nullable();

            /*
            |--------------------------------------------------------------------------
            | FAQ SECTION
            |--------------------------------------------------------------------------
            */

            $table->string('faq_title')->nullable();
            $table->json('faq_items')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personals');
    }
};
