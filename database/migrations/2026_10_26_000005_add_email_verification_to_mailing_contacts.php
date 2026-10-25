<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('mailing_contacts', function (Blueprint $table) {
            $table->timestamp('email_verified_at')->nullable();
            $table->string('email_verification_status', 30)->default('not_sent');
            $table->string('email_verification_token_hash', 64)->nullable();
            $table->timestamp('email_verification_expires_at')->nullable();
            $table->timestamp('email_verification_sent_at')->nullable();
            $table->text('email_verification_error')->nullable();
        });
    }
    public function down(): void {
        Schema::table('mailing_contacts', function (Blueprint $table) {
            $table->dropColumn(['email_verified_at','email_verification_status','email_verification_token_hash','email_verification_expires_at','email_verification_sent_at','email_verification_error']);
        });
    }
};
