<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        if (! Schema::hasColumn('closed_groups', 'pricing_button_url')) {
            Schema::table('closed_groups', function (Blueprint $table): void {
                $table->text('pricing_button_url')->nullable();
            });
        }
    }
    public function down(): void {
        // Preserve checkout URLs on rollback.
    }
};
