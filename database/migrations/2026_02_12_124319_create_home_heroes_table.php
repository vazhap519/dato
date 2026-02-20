<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('home_heroes', function (Blueprint $table) {
            $table->id();

            $table->string('badge_text')->nullable();          // "Внутреннее пробуждение"
            $table->string('title_line_1')->nullable();        // "Давид"
            $table->string('title_highlight')->nullable();     // "Арутюнов"
            $table->text('subtitle')->nullable();              // описания

            $table->string('primary_button_text')->nullable(); // "Продукты и услуги"
            $table->string('primary_button_href')->nullable(); // "#products" ან "/products"

            $table->string('secondary_button_text')->nullable(); // "Узнать больше"
            $table->string('secondary_button_href')->nullable(); // "#about"

            $table->boolean('is_active')->default(true); // თუ რამდენიმე hero გინდა მომავალში
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('home_heroes');
    }
};
