<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Text on the six landing pages and their subpages.
        Schema::create('explore_content_pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 50)->unique();
            $table->string('title', 150);
            $table->jsonb('copy')->default('{}');
            $table->timestamps();
        });

        // A single editable item: emotion, dream, scenario, option set, daily question, etc.
        Schema::create('explore_content_items', function (Blueprint $table) {
            $table->id();
            $table->string('page_slug', 50)->index();
            $table->string('document', 80);
            $table->string('group_key', 80);
            $table->string('entry_key', 120);
            $table->string('title', 255);
            $table->unsignedSmallInteger('position')->default(0);
            $table->jsonb('payload');
            $table->timestamps();
            $table->unique(['document', 'group_key', 'entry_key'], 'explore_content_item_unique');
            $table->index(['page_slug', 'group_key'], 'explore_content_item_section');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('explore_content_items');
        Schema::dropIfExists('explore_content_pages');
    }
};
