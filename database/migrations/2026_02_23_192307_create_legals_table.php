<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('legals', function (Blueprint $table) {
            $table->id();

            // HEADER
            $table->string('title')->nullable();
            $table->text('subtitle')->nullable();
            $table->string('download_button_text')->nullable();

            // SIDEBAR LINKS
            $table->json('sections_nav')->nullable();

            // PRIVACY
            $table->string('privacy_title')->nullable();
            $table->longText('privacy_content')->nullable();

            // AGREEMENT
            $table->string('agreement_title')->nullable();
            $table->longText('agreement_content')->nullable();

            // OFFER
            $table->string('offer_title')->nullable();
            $table->longText('offer_content')->nullable();

            // COMPANY DETAILS
            $table->string('details_title')->nullable();
            $table->json('company_details')->nullable();

            // FOOTER CTA
            $table->string('cta_title')->nullable();
            $table->text('cta_description')->nullable();
            $table->string('cta_button_text')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('legals');
    }
};
