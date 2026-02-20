<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('footers', function (Blueprint $table) {
            $table->id();

            // Left column
            $table->string('brand_name');
            $table->text('description');

            // Navigation column
            $table->string('nav_title')->nullable();
    

            // Support column
            $table->string('support_title')->default('Поддержка');
            $table->string('support_faq')->nullable();
            $table->string('support_payment')->nullable();
            $table->string('support_privacy')->nullable();
            $table->string('support_offer')->nullable();

            // Contacts column
            $table->string('Contact_title')->nullable();
            $table->string('email');
            $table->string('location');

            // Bottom bar
            $table->string('copyright');

            // Social links
            $table->string('youtube')->nullable();
            $table->string('telegram')->nullable();
            $table->string('tiktok')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('footers');
    }
};
