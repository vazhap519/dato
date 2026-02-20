<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('navigation_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('landing_page_id')
                ->constrained('landing_pages')
                ->cascadeOnDelete();

            $table->string('label');
            $table->string('href'); // this becomes section id
            $table->unsignedInteger('sort')->default(0);
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->index(['landing_page_id', 'sort']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('navigation_items');
    }
};
