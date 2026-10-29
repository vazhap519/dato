<?php

namespace Tests\Feature;

use App\Support\ArchetypeMirrorSurvey;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class ArchetypeMirrorStatisticsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // The shared Inertia middleware queries unrelated site content tables.
        $this->withoutMiddleware(\App\Http\Middleware\HandleInertiaRequests::class);

        // Isolate only the new tables; no full production migrations are needed.
        Schema::create('archetypes', function (Blueprint $table) {
            $table->id();
            $table->string('slug');
            $table->string('title');
            $table->unsignedInteger('sort')->default(0);
            $table->boolean('is_published')->default(true);
        });

        foreach (['controller', 'observer', 'seeker', 'rescuer', 'protector', 'critic', 'wanderer', 'creator'] as $index => $slug) {
            DB::table('archetypes')->insert([
                'slug' => $slug,
                'title' => $slug,
                'sort' => $index,
                'is_published' => true,
            ]);
        }

        $migration = require database_path('migrations/2026_10_29_230000_create_archetype_mirror_statistics_tables.php');
        $migration->up();
    }

    private function payload(array $overrides = []): array
    {
        return array_replace([
            'version' => ArchetypeMirrorSurvey::VERSION,
            'submission_id' => '1b24b0ee-92df-4cee-988e-567ca15175db',
            'answers' => array_fill(0, 20, 0),
        ], $overrides);
    }

    public function test_completed_survey_is_aggregated_once_without_personal_response_records(): void
    {
        $endpoint = '/explore/archetypes/mirror/statistics';
        $this->postJson($endpoint, $this->payload())->assertNoContent();
        $this->postJson($endpoint, $this->payload(['answers' => array_fill(0, 20, 1)]))->assertNoContent();

        // No consent field is sent, yet the completed response is recorded once.
        $this->assertSame(1, (int) DB::table('archetype_mirror_daily_totals')->sum('completions'));
        $this->assertSame(20, (int) DB::table('archetype_mirror_daily_answers')->sum('votes'));
        $this->assertSame(20, (int) DB::table('archetype_mirror_daily_roles')->sum('votes'));
        $this->assertSame(1, DB::table('archetype_mirror_receipts')->count());
        $this->assertSame(20, DB::table('archetype_mirror_daily_answers')->count());
        $this->assertFalse(Schema::hasColumn('archetype_mirror_receipts', 'answers'));
        $this->assertFalse(Schema::hasColumn('archetype_mirror_receipts', 'telegram_id'));
        $this->assertFalse(Schema::hasColumn('archetype_mirror_receipts', 'ip_address'));
        $this->assertSame(64, strlen(DB::table('archetype_mirror_receipts')->value('token_hash')));
    }

    public function test_no_consent_flag_is_needed_and_invalid_responses_are_not_counted(): void
    {
        $endpoint = '/explore/archetypes/mirror/statistics';
        $this->postJson($endpoint, $this->payload(['answers' => array_fill(0, 19, 0)]))->assertStatus(422);
        $this->postJson($endpoint, $this->payload(['answers' => array_fill(0, 20, 4)]))->assertStatus(422);
        $this->postJson($endpoint, $this->payload(['answers' => array_fill(0, 20, true)]))->assertStatus(422);
        $this->postJson($endpoint, $this->payload(['version' => 'mirror-v2']))->assertStatus(422);

        $this->assertSame(0, DB::table('archetype_mirror_daily_totals')->count());
        $this->assertSame(0, DB::table('archetype_mirror_receipts')->count());
    }

    public function test_question_file_matches_expected_structure(): void
    {
        $questions = ArchetypeMirrorSurvey::questions();
        $this->assertCount(20, $questions);
        foreach ($questions as $question) {
            $this->assertCount(4, $question['options']);
            foreach ($question['options'] as $option) {
                $this->assertNotEmpty($option['label']);
                $this->assertNotEmpty($option['slug']);
            }
        }
    }
}
