<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('practice_contents', function (Blueprint $table) {

            $table->foreignId('closed_group_id')
                ->nullable()
                ->after('practice_id') // თუ გინდა კონკრეტული პოზიცია
                ->constrained('closed_groups')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('practice_contents', function (Blueprint $table) {

            $table->dropForeign(['closed_group_id']);
            $table->dropColumn('closed_group_id');
        });
    }
};
