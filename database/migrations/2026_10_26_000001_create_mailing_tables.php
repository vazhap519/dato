<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('mailing_contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('email')->unique();
            $table->string('phone', 40)->nullable();
            $table->string('source', 80)->default('editoria');
            $table->boolean('practice_reminders')->default(true);
            $table->boolean('marketing_consent')->default(false);
            $table->timestamp('consented_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->string('unsubscribe_token', 64)->unique();
            $table->timestamps();
        });
        Schema::create('mailing_deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mailing_contact_id')->constrained()->cascadeOnDelete();
            $table->string('type', 60);
            $table->date('practice_date')->nullable();
            $table->string('status', 30)->default('pending');
            $table->text('error')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
            $table->unique(['mailing_contact_id', 'type', 'practice_date']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('mailing_deliveries');
        Schema::dropIfExists('mailing_contacts');
    }
};
