<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('editorias', function (Blueprint $table) {
            $table->string('hero_title_accent')->nullable();
        });

        // The former admin title was not displayed on the website.
        // Preserve custom values, but align the old seeded title with the visible heading.
        DB::table('editorias')->where('hero_title', 'Познай себя')->update([
            'hero_title' => 'Устал жить',
            'hero_title_accent' => 'на автомате?',
        ]);
    }

    public function down(): void
    {
        Schema::table('editorias', function (Blueprint $table) {
            $table->dropColumn('hero_title_accent');
        });
    }
};
