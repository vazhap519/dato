<?php

namespace App\Filament\Pages;

use App\Models\Archetype;
use App\Support\ArchetypeMirrorSurvey;
use Filament\Pages\Page;
use Illuminate\Support\Facades\DB;

class ArchetypeMirrorStatistics extends Page
{
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-chart-bar-square';
    protected static ?string $navigationLabel = 'Статистика архетипов';
    protected static ?string $title = 'Статистика «Зеркала архетипов»';
    protected static string | \UnitEnum | null $navigationGroup = 'Самопознание';
    protected static ?int $navigationSort = 21;
    protected string $view = 'filament.pages.archetype-mirror-statistics';

    public string $period = '30';

    private function restrictPeriod($query)
    {
        $start = match ($this->period) {
            'today' => now()->toDateString(),
            '7' => now()->subDays(6)->toDateString(),
            '30' => now()->subDays(29)->toDateString(),
            default => null,
        };

        if ($start !== null) {
            $query->where('day', '>=', $start);
        }

        return $query;
    }

    public function getReport(): array
    {
        $questions = ArchetypeMirrorSurvey::questions();
        $version = ArchetypeMirrorSurvey::VERSION;
        $completions = (int) $this->restrictPeriod(
            DB::table('archetype_mirror_daily_totals')->where('version', $version)
        )->sum('completions');

        $answerRows = $this->restrictPeriod(
            DB::table('archetype_mirror_daily_answers')->where('version', $version)
        )->selectRaw('question_index, option_index, SUM(votes) AS total')
            ->groupBy('question_index', 'option_index')->get();

        $answerCounts = [];
        foreach ($answerRows as $row) {
            $answerCounts[(int) $row->question_index][(int) $row->option_index] = (int) $row->total;
        }

        $questionReport = [];
        $popular = [];
        $exposures = [];
        foreach ($questions as $index => $question) {
            $items = [];
            $votes = array_sum($answerCounts[$index] ?? []);
            foreach ($question['options'] as $optionIndex => $option) {
                $exposures[$option['slug']] = ($exposures[$option['slug']] ?? 0) + 1;
                $count = (int) ($answerCounts[$index][$optionIndex] ?? 0);
                $item = [
                    'index' => $optionIndex,
                    'label' => $option['label'],
                    'slug' => $option['slug'],
                    'count' => $count,
                    'percentage' => $votes > 0 ? round(100 * $count / $votes, 1) : 0,
                ];
                $items[] = $item;
                $popular[] = [
                    'question' => $index + 1,
                    'question_text' => $question['text'],
                    ...$item,
                ];
            }
            $questionReport[] = [
                'number' => $index + 1,
                'title' => $question['text'],
                'votes' => $votes,
                'options' => $items,
            ];
        }

        usort($popular, fn ($a, $b) => ($b['count'] <=> $a['count']) ?:
            ($a['question'] <=> $b['question']) ?: ($a['index'] <=> $b['index']));

        $roleRows = $this->restrictPeriod(
            DB::table('archetype_mirror_daily_roles')->where('version', $version)
        )->selectRaw('slug, SUM(votes) AS votes, SUM(first_place) AS first_place, SUM(top_three) AS top_three')
            ->groupBy('slug')->get()->keyBy('slug');

        $names = Archetype::query()->pluck('title', 'slug')->all();
        $roles = [];
        foreach ($exposures as $slug => $appearances) {
            $row = $roleRows->get($slug);
            $votes = (int) ($row->votes ?? 0);
            $first = (int) ($row->first_place ?? 0);
            $roles[] = [
                'slug' => $slug,
                'title' => $names[$slug] ?? $slug,
                'votes' => $votes,
                'appearances' => $appearances,
                'first_place' => $first,
                'top_three' => (int) ($row->top_three ?? 0),
                // The eight roles do not occur equally often as answer options.
                'selection_rate' => $completions > 0
                    ? round(100 * $votes / ($completions * $appearances), 1) : 0,
                'first_place_rate' => $completions > 0 ? round(100 * $first / $completions, 1) : 0,
            ];
        }

        usort($roles, fn ($a, $b) => ($b['selection_rate'] <=> $a['selection_rate']) ?:
            ($b['votes'] <=> $a['votes']));

        return [
            'completions' => $completions,
            'questions' => $questionReport,
            'roles' => $roles,
            'popular' => array_slice($popular, 0, 5),
            'version' => $version,
        ];
    }
}
