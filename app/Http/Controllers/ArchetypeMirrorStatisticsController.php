<?php

namespace App\Http\Controllers;

use App\Models\Archetype;
use App\Support\ArchetypeMirrorSurvey;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ArchetypeMirrorStatisticsController extends Controller
{
    /**
     * Automatically aggregate a completed 20-question survey.
     * Store aggregate counters, not individual responses or Telegram/site IDs.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'version' => ['required', 'in:'.ArchetypeMirrorSurvey::VERSION],
            'submission_id' => ['required', 'uuid'],
            'answers' => ['required', 'array', 'size:20'],
            'answers.*' => ['required', 'integer', 'between:0,3'],
        ]);

        $questions = ArchetypeMirrorSurvey::questions();
        $answers = $data['answers'];

        // Only a dense array of exactly 20 numeric option indices is accepted.
        if (!array_is_list($answers)) {
            throw ValidationException::withMessages(['answers' => 'Некорректный порядок ответов.']);
        }

        $scores = [];
        foreach ($questions as $index => $question) {
            $option = $answers[$index];
            if (!is_int($option) || !isset($question['options'][$option]['slug'])) {
                throw ValidationException::withMessages(['answers' => 'Некорректный вариант ответа.']);
            }
            $slug = $question['options'][$option]['slug'];
            $scores[$slug] = ($scores[$slug] ?? 0) + 1;
        }

        // Resolve first-place ties exactly like the public result map.
        $ordered = Archetype::query()->where('is_published', true)
            ->orderBy('sort')->orderBy('id')->pluck('slug')->all();
        foreach (array_keys($scores) as $slug) {
            if (!in_array($slug, $ordered, true)) {
                $ordered[] = $slug;
            }
        }
        $ranked = array_values(array_filter($ordered, fn ($slug) => ($scores[$slug] ?? 0) > 0));
        $positions = array_flip($ordered);
        usort($ranked, fn ($a, $b) => ($scores[$b] <=> $scores[$a]) ?: ($positions[$a] <=> $positions[$b]));
        $first = $ranked[0] ?? null;
        $topThree = array_slice($ranked, 0, 3);

        $day = now()->toDateString();
        $version = ArchetypeMirrorSurvey::VERSION;
        // The random receipt token is for retry safety only, not a user identifier.
        $hash = hash('sha256', $data['submission_id']);

        DB::transaction(function () use ($hash, $day, $version, $answers, $scores, $first, $topThree) {
            $new = DB::table('archetype_mirror_receipts')->insertOrIgnore([
                'token_hash' => $hash,
                'version' => $version,
                'created_at' => now(),
            ]);
            if ($new !== 1) {
                return; // A network retry of the same result must not double-count.
            }

            DB::statement('
                INSERT INTO archetype_mirror_daily_totals(day, version, completions)
                VALUES (?, ?, 1)
                ON CONFLICT(day, version)
                DO UPDATE SET completions = archetype_mirror_daily_totals.completions + 1
            ', [$day, $version]);

            foreach ($answers as $questionIndex => $optionIndex) {
                DB::statement('
                    INSERT INTO archetype_mirror_daily_answers(day, version, question_index, option_index, votes)
                    VALUES (?, ?, ?, ?, 1)
                    ON CONFLICT(day, version, question_index, option_index)
                    DO UPDATE SET votes = archetype_mirror_daily_answers.votes + 1
                ', [$day, $version, $questionIndex, $optionIndex]);
            }

            foreach ($scores as $slug => $votes) {
                $firstVote = $slug === $first ? 1 : 0;
                $topVote = in_array($slug, $topThree, true) ? 1 : 0;
                DB::statement('
                    INSERT INTO archetype_mirror_daily_roles(day, version, slug, votes, first_place, top_three)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON CONFLICT(day, version, slug)
                    DO UPDATE SET
                        votes = archetype_mirror_daily_roles.votes + EXCLUDED.votes,
                        first_place = archetype_mirror_daily_roles.first_place + EXCLUDED.first_place,
                        top_three = archetype_mirror_daily_roles.top_three + EXCLUDED.top_three
                ', [$day, $version, $slug, $votes, $firstVote, $topVote]);
            }

            // Receipts expire after 90 days; historical totals are kept separately.
            DB::table('archetype_mirror_receipts')
                ->where('created_at', '<', now()->subDays(90))
                ->delete();
        });

        return response()->noContent();
    }
}
