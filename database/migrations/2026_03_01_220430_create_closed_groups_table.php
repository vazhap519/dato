<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('closed_groups', function (Blueprint $table) {
            $table->id();

            /* ===============================
             * HERO
             * =============================== */
            $table->string('hero_badge')->nullable();
            $table->string('hero_title')->nullable();
            $table->string('hero_title_highlight')->nullable();
            $table->text('hero_description')->nullable();
            $table->string('hero_button_primary')->nullable();
            $table->string('hero_button_secondary')->nullable();

            /* ===============================
             * CONDITIONS (Repeater JSON)
             * =============================== */
            $table->json('conditions')->nullable();

            /* ===============================
             * PROMO VIDEO
             * =============================== */
            $table->string('promo_title')->nullable();

            /* ===============================
             * DESCRIPTION
             * =============================== */
            $table->string('description_title')->nullable();
            $table->text('description_content')->nullable();

            /* ===============================
             * PROGRAM (Repeater JSON)
             * =============================== */
            $table->json('program')->nullable();
            $table->string('program_title')->nullable();

            /* ===============================
             * AUTHOR
             * =============================== */
            $table->string('author_name')->nullable();
            $table->string('author_subtitle')->nullable();
            $table->text('author_bio_1')->nullable();
            $table->text('author_bio_2')->nullable();

            /* ===============================
             * FAQ (Repeater JSON)
             * =============================== */
            $table->string('faq_title')->nullable();
            $table->json('faq')->nullable();

            /* ===============================
             * PRICING
             * =============================== */
            $table->string('pricing_badge')->nullable();
            $table->string('pricing_title')->nullable();
            $table->string('pricing_old_price')->nullable();
            $table->string('pricing_current_price')->nullable();
            $table->string('pricing_button_text')->nullable();
            $table->string('pricing_note')->nullable();

            /* Pricing Features (Repeater JSON) */
            $table->json('pricing_features')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('closed_groups');
    }
};
