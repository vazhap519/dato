<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $columns = [
            'hero_button_url',
            'quote_button_url',
            'program_button_url',
            'for_whom_button_url',
            'why_button_url',
            'author_button_url',
            'cta_button_url',
        ];

        foreach ($columns as $column) {
            if (! Schema::hasColumn('editorias', $column)) {
                Schema::table('editorias', function (Blueprint $table) use ($column): void {
                    $table->text($column)->nullable();
                });
            }
        }
    }

    public function down(): void
    {
        // Keep existing button URLs and avoid accidental data loss on rollback.
    }
};
