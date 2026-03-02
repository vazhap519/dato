<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('practice_contents', function (Blueprint $table) {

            // 1️⃣ დაამატე slug nullable (უსაფრთხო გზა)
            $table->string('slug')->nullable();

        });

        // 2️⃣ წაშალე telegram_url ცალკე call-ში (Postgres safer)
        Schema::table('practice_contents', function (Blueprint $table) {
            if (Schema::hasColumn('practice_contents', 'telegram_url')) {
                $table->dropColumn('telegram_url');
            }
        });
    }

    public function down(): void
    {
        Schema::table('practice_contents', function (Blueprint $table) {

            // დააბრუნე telegram_url
            $table->string('telegram_url')->nullable();

            // წაშალე slug
            $table->dropColumn('slug');
        });
    }
};
