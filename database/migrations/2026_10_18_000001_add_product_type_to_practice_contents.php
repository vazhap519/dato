<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('practice_contents', function (Blueprint $table) {
            $table->string('product_type')->default('closed_group');
        });
    }

    public function down(): void
    {
        Schema::table('practice_contents', function (Blueprint $table) {
            $table->dropColumn('product_type');
        });
    }
};
