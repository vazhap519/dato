<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('mailing_automations', function (Blueprint $table) {
            $table->string('trigger_event', 40)->default('manual');
            $table->unsignedInteger('delay_minutes')->default(0);
            $table->string('audience', 30)->default('marketing');
        });
        Schema::table('mailing_deliveries', function (Blueprint $table) {
            $table->foreignId('mailing_automation_id')->nullable()->constrained('mailing_automations')->nullOnDelete();
        });
    }
    public function down(): void {
        Schema::table('mailing_deliveries', fn (Blueprint $table) => $table->dropConstrainedForeignId('mailing_automation_id'));
        Schema::table('mailing_automations', fn (Blueprint $table) => $table->dropColumn(['trigger_event','delay_minutes','audience']));
    }
};
