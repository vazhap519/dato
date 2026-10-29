<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // One random token per consenting completion; never store the answer vector.
        Schema::create('archetype_mirror_receipts', function (Blueprint $table) {
            $table->char('token_hash', 64)->primary();
            $table->string('version', 32);
            $table->timestampTz('created_at')->useCurrent();
            $table->index('created_at', 'am_receipts_created_idx');
        });

        Schema::create('archetype_mirror_daily_totals', function (Blueprint $table) {
            $table->date('day');
            $table->string('version', 32);
            $table->unsignedBigInteger('completions')->default(0);
            $table->primary(['day', 'version'], 'am_totals_pk');
        });

        Schema::create('archetype_mirror_daily_answers', function (Blueprint $table) {
            $table->date('day');
            $table->string('version', 32);
            $table->unsignedSmallInteger('question_index');
            $table->unsignedTinyInteger('option_index');
            $table->unsignedBigInteger('votes')->default(0);
            $table->primary(['day', 'version', 'question_index', 'option_index'], 'am_answers_pk');
        });

        Schema::create('archetype_mirror_daily_roles', function (Blueprint $table) {
            $table->date('day');
            $table->string('version', 32);
            $table->string('slug', 64);
            $table->unsignedBigInteger('votes')->default(0);
            $table->unsignedBigInteger('first_place')->default(0);
            $table->unsignedBigInteger('top_three')->default(0);
            $table->primary(['day', 'version', 'slug'], 'am_roles_pk');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('archetype_mirror_daily_roles');
        Schema::dropIfExists('archetype_mirror_daily_answers');
        Schema::dropIfExists('archetype_mirror_daily_totals');
        Schema::dropIfExists('archetype_mirror_receipts');
    }
};
