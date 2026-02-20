<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('shop_products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('shop_id')
                ->constrained('shops')
                ->cascadeOnDelete();

            $table->string('badge')->nullable();          // "The Foundation"
            $table->string('title')->nullable();          // Card title
            $table->text('description')->nullable();      // Card text
            $table->string('button_text')->nullable();    // "Подробнее"
            $table->string('button_url')->nullable();     // link

            $table->unsignedInteger('sort')->default(0);
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->index(['shop_id', 'sort']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_products');
    }
};
