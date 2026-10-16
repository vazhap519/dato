<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('editorias', function (Blueprint $table) {
            $table->string('quote_button_url')->nullable();
            $table->string('program_button_url')->nullable();
            $table->string('for_whom_button_url')->nullable();
            $table->string('why_button_url')->nullable();
            $table->string('author_button_url')->nullable();
            $table->string('cta_button_url')->nullable();
        });

        // Set sensible destinations for existing records without altering their text.
        foreach ([
            'quote_button_url' => 'https://t.me/praynwin',
            'program_button_url' => 'https://t.me/praynwin',
            'for_whom_button_url' => 'https://t.me/praynwin',
            'why_button_url' => 'https://t.me/praynwin',
            'author_button_url' => '/personal',
            'cta_button_url' => 'https://t.me/praynwin',
        ] as $column => $url) {
            DB::table('editorias')->whereNull($column)->update([$column => $url]);
        }
    }

    public function down(): void
    {
        Schema::table('editorias', function (Blueprint $table) {
            $table->dropColumn([
                'quote_button_url',
                'program_button_url',
                'for_whom_button_url',
                'why_button_url',
                'author_button_url',
                'cta_button_url',
            ]);
        });
    }
};
