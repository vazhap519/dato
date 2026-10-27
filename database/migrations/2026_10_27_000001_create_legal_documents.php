<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('legal_documents', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 32)->unique();
            $table->string('title');
            $table->longText('content')->nullable();
            $table->string('version', 30)->default('1.0');
            $table->date('effective_at')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
        Schema::create('legal_document_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('legal_document_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->longText('content')->nullable();
            $table->string('version', 30);
            $table->date('effective_at')->nullable();
            $table->timestamp('archived_at');
        });
        $legacy = DB::table('legals')->orderBy('id')->first();
        foreach ([
            'terms' => ['agreement_title', 'agreement_content', 'Условия использования сайта'],
            'privacy' => ['privacy_title', 'privacy_content', 'Политика конфиденциальности'],
            'offer' => ['offer_title', 'offer_content', 'Публичная оферта'],
        ] as $slug => [$titleKey, $contentKey, $fallback]) {
            $content = $legacy?->{$contentKey};
            DB::table('legal_documents')->insert([
                'slug' => $slug, 'title' => $legacy?->{$titleKey} ?: $fallback,
                'content' => $content, 'version' => '1.0',
                // Legacy offer must be reviewed before being presented as the current contract.
                'is_published' => $slug !== 'offer' && filled($content),
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }
    public function down(): void {
        Schema::dropIfExists('legal_document_versions');
        Schema::dropIfExists('legal_documents');
    }
};
