<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('footers', function (Blueprint $table) {
            $table->json('navigation_links')->nullable();
            $table->string('bottom_tagline')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('footers', fn (Blueprint $table) => $table->dropColumn(['navigation_links', 'bottom_tagline']));
    }
};
