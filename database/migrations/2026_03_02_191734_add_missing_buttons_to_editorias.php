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
        Schema::table('editorias', function (Blueprint $table) {
            $table->string('program_button_text')->nullable();
            $table->string('for_whom_button_text')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('editorias', function (Blueprint $table) {
            $table->dropColumn('program_button_text');
            $table->dropColumn('for_whom_button_text');
        });
    }};
