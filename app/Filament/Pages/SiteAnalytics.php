<?php
namespace App\Filament\Pages;

use Filament\Pages\Page;
use Illuminate\Support\Facades\DB;
use Filament\Actions\Action;
use Filament\Notifications\Notification;

class SiteAnalytics extends Page
{
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-chart-bar';
    protected static ?string $navigationLabel = 'Аналитика сайта';
    protected static ?string $title = 'Аналитика сайта';
    protected static string | \UnitEnum | null $navigationGroup = 'Аналитика';
    protected string $view = 'filament.pages.site-analytics';

    public string $period = '30';
    public string $tab = 'overview';

    private function since(): \Illuminate\Support\Carbon
    {
        return match ($this->period) {
            'today' => now()->startOfDay(),
            'yesterday' => now()->subDay()->startOfDay(),
            '7' => now()->subDays(6)->startOfDay(),
            default => now()->subDays(29)->startOfDay(),
        };
    }

    private function until(): \Illuminate\Support\Carbon
    {
        return $this->period === 'yesterday' ? now()->subDay()->endOfDay() : now();
    }

    private function events()
    {
        return DB::table('site_analytics_events')->whereBetween('occurred_at', [$this->since(), $this->until()]);
    }


    protected function getHeaderActions(): array
    {
        return [
            Action::make("resetAnalytics")
                ->label("Сбросить аналитику")
                ->icon("heroicon-o-trash")
                ->color("danger")
                ->requiresConfirmation()
                ->modalHeading("Удалить всю аналитику сайта?")
                ->modalDescription("Все сохранённые события, просмотры, нажатия и история действий будут удалены без возможности восстановления. Новые события продолжат собираться.")
                ->modalSubmitActionLabel("Да, удалить всё")
                ->action(function (): void {
                    $deleted = DB::table("site_analytics_events")->delete();
                    Notification::make()->title("Аналитика сброшена")->body("Удалено событий: {$deleted}.")->success()->send();
                }),
        ];
    }

    public function getStats(): array
    {
        $query = $this->events();
        return [
            'events' => (clone $query)->count(),
            'views' => (clone $query)->where('event', 'page_view')->count(),
            'visitors' => (clone $query)->distinct('visitor_id')->count('visitor_id'),
            'clicks' => (clone $query)->whereIn('event', ['cta_click', 'link_click'])->count(),
        ];
    }

    public function getPopularPages()
    {
        return $this->events()
            ->select('path', DB::raw('COUNT(*) as views'))
            ->where('event', 'page_view')
            ->groupBy('path')->orderByDesc('views')->limit(15)->get();
    }

    public function getDailyViews(): array
    {
        $rows = $this->events()
            ->selectRaw("DATE(occurred_at) as day, COUNT(*) as views")
            ->where('event', 'page_view')
            
            ->groupByRaw('DATE(occurred_at)')
            ->pluck('views', 'day');
        $days = [];
        $count = match ($this->period) { 'today', 'yesterday' => 1, '7' => 7, default => 30 };
        for ($i = $count - 1; $i >= 0; $i--) {
            $date = $this->until()->copy()->subDays($i)->toDateString();
            $days[] = ['date' => $date, 'label' => $this->until()->copy()->subDays($i)->format('d.m'), 'views' => (int) ($rows[$date] ?? 0)];
        }
        return $days;
    }

    public function getDevices()
    {
        return $this->events()
            ->select('device', DB::raw('COUNT(*) as total'))
            ->where('event', 'page_view')
            ->groupBy('device')->orderByDesc('total')->get();
    }

    public function getSources()
    {
        $source = "CASE
            WHEN lower(coalesce(utm_source, '')) ~ '(facebook|instagram|meta|fb)' THEN 'Meta'
            WHEN lower(coalesce(utm_source, '')) ~ '(google|adwords)' THEN 'Google'
            WHEN lower(coalesce(utm_source, '')) ~ '(tiktok)' THEN 'TikTok'
            WHEN lower(coalesce(utm_source, '')) ~ '(youtube)' THEN 'YouTube'
            WHEN lower(coalesce(utm_source, '')) ~ '(telegram|^tg$)' THEN 'Telegram'
            WHEN NULLIF(utm_source, '') IS NOT NULL THEN utm_source
            WHEN lower(coalesce(referrer_host, '')) ~ '(facebook|instagram|fb\\.com)' THEN 'Meta'
            WHEN lower(coalesce(referrer_host, '')) ~ '(google\\.)' THEN 'Google'
            WHEN lower(coalesce(referrer_host, '')) ~ '(tiktok)' THEN 'TikTok'
            WHEN lower(coalesce(referrer_host, '')) ~ '(youtube|youtu\\.be)' THEN 'YouTube'
            WHEN lower(coalesce(referrer_host, '')) ~ '(telegram|t\\.me)' THEN 'Telegram'
            WHEN referrer_host IS NULL OR referrer_host = '' OR lower(referrer_host) IN ('arutyun.me', 'www.arutyun.me') THEN 'Прямой / неизвестен'
            ELSE referrer_host END";
        return $this->events()
            ->selectRaw("{$source} as source, COUNT(*) as total")
            ->where('event', 'page_view')
            ->groupByRaw($source)
            ->orderByDesc('total')->limit(8)->get();
    }

    public function getTopClicks()
    {
        return $this->events()
            ->select('element', DB::raw('COUNT(*) as total'))
            ->whereIn('event', ['cta_click', 'link_click'])
            ->whereNotNull('element')
            ->groupBy('element')->orderByDesc('total')->limit(8)->get();
    }

    public function getFunnel(): array
    {
        $views = (clone $this->events())->where('event', 'page_view')
            ->where('path', '/editoria')->distinct()->count('session_id');
        $names = ['HeroJoinClick', 'ProgramJoinClick', 'HowToJoinClick', 'FinalJoinClick', 'MobileJoinClick',
            'Практикум · запись в первом экране', 'Практикум · запись в программе',
            'Практикум · запись в инструкции', 'Практикум · запись внизу страницы',
            'Практикум · мобильная кнопка записи'];
        $clicks = (clone $this->events())->where('path', '/editoria')
            ->whereIn('event', ['cta_click', 'link_click'])
            ->whereIn('element', $names)->distinct()->count('session_id');
        return ['views' => $views, 'clicks' => $clicks, 'rate' => $views ? round($clicks / $views * 100, 1) : 0];
    }

    public function getPageConversions(): array
    {
        $pages = [
            ['path' => '/editoria', 'label' => 'Практикум', 'elements' => ['HeroJoinClick','ProgramJoinClick','HowToJoinClick','FinalJoinClick','MobileJoinClick','Практикум · запись в первом экране','Практикум · запись в программе','Практикум · запись в инструкции','Практикум · запись внизу страницы','Практикум · мобильная кнопка записи']],
            ['path' => '/personal', 'label' => 'Консультации', 'elements' => []],
        ];
        return array_map(function ($page) {
            $views = (clone $this->events())->where('event', 'page_view')->where('path', $page['path'])->distinct()->count('session_id');
            $clickQuery = (clone $this->events())->where('path', $page['path'])->whereIn('event', ['link_click', 'cta_click']);
            if ($page['elements']) $clickQuery->whereIn('element', $page['elements']);
            $clicks = $clickQuery->distinct()->count('session_id');
            return ['label' => $page['label'], 'path' => $page['path'], 'views' => $views, 'clicks' => $clicks, 'rate' => $views ? round($clicks / $views * 100, 1) : 0];
        }, $pages);
    }

    public function getDeviceConversions(): array
    {
        $devices = (clone $this->events())->where('event', 'page_view')->where('path', '/editoria')
            ->select('device')->distinct()->pluck('device');
        $result = [];
        foreach ($devices as $device) {
            $views = (clone $this->events())->where('event', 'page_view')->where('path', '/editoria')
                ->where('device', $device)->distinct()->count('session_id');
            $clicks = (clone $this->events())->where('path', '/editoria')->where('device', $device)
                ->whereIn('event', ['cta_click', 'link_click'])
                ->where(function ($query) {
                    $query->whereIn('element', ['HeroJoinClick','ProgramJoinClick','HowToJoinClick','FinalJoinClick','MobileJoinClick'])
                        ->orWhere('element', 'like', 'Практикум · запись%');
                })->distinct()->count('session_id');
            $result[] = ['device' => $device ?: 'unknown', 'views' => $views, 'clicks' => $clicks,
                'rate' => $views ? round($clicks / $views * 100, 1) : 0];
        }
        return $result;
    }

    public function getComparison(): array
    {
        $from = $this->since();
        $to = $this->until();
        $seconds = $from->diffInSeconds($to) + 1;
        $previousTo = $from->copy()->subSecond();
        $previousFrom = $previousTo->copy()->subSeconds($seconds - 1);
        $current = $this->getStats();
        $previousQuery = DB::table('site_analytics_events')->whereBetween('occurred_at', [$previousFrom, $previousTo]);
        $previous = [
            'views' => (clone $previousQuery)->where('event', 'page_view')->count(),
            'visitors' => (clone $previousQuery)->distinct()->count('session_id'),
            'clicks' => (clone $previousQuery)->whereIn('event', ['cta_click', 'link_click'])->count(),
        ];
        $result = [];
        foreach (['views', 'visitors', 'clicks'] as $key) {
            $old = $previous[$key];
            $result[$key] = ['current' => $current[$key], 'previous' => $old,
                'change' => $old > 0 ? round(($current[$key] - $old) / $old * 100, 1) : null];
        }
        return $result;
    }

    public function exportCsv()
    {
        $rows = $this->events()->orderBy('occurred_at')->get([
            'occurred_at', 'event', 'path', 'element', 'device', 'browser',
            'referrer_host', 'utm_source', 'utm_medium', 'utm_campaign'
        ]);
        return response()->streamDownload(function () use ($rows) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, ['Время', 'Событие', 'Страница', 'Элемент', 'Устройство', 'Браузер',
                'Источник', 'UTM source', 'UTM medium', 'UTM campaign']);
            foreach ($rows as $row) {
                $values = array_values((array) $row);
                // Prevent CSV formula execution when opened in spreadsheet programs.
                $values = array_map(function ($value) {
                    $value = (string) ($value ?? '');
                    return preg_match('/^[=+@\\-\\t\\r]/u', $value) ? "'" . $value : $value;
                }, $values);
                fputcsv($out, $values);
            }
            fclose($out);
        }, 'analytics-' . now()->format('Y-m-d') . '.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    public function getExploreFunnel(): array
    {
        $tools = [
            'numbers' => 'Язык чисел',
            'emotions' => 'Язык эмоций',
            'archetypes' => 'Язык архетипов',
            'archetype-mirror' => 'Зеркало архетипов',
            'dreams' => 'Язык снов',
            'patterns' => 'Язык повторений',
            'personality-mirror' => 'Зеркало личности',
            'relationships' => 'Язык отношений',
            'body' => 'Язык тела',
            'choice' => 'Язык выбора',
            'beliefs' => 'Язык убеждений',
            'values' => 'Язык ценностей',
            'fears' => 'Язык страхов',
            'time' => 'Язык времени',
            'conflicts' => 'Язык внутренних конфликтов',
            'attention' => 'Язык внимания',
        ];
        $rows = [];
        foreach ($tools as $key => $title) {
            $base = $this->events()->where('element', $key);
            $counts = [];
            foreach (['explore_start', 'explore_complete', 'explore_practice'] as $event) {
                $counts[$event] = (clone $base)->where('event', $event)->distinct()->count('session_id');
            }
            $rows[] = [
                'title' => $title,
                'started' => $counts['explore_start'],
                'completed' => $counts['explore_complete'],
                'practice' => $counts['explore_practice'],
                'completion_rate' => $counts['explore_start']
                    ? round($counts['explore_complete'] / $counts['explore_start'] * 100, 1) : 0,
            ];
        }
        $views = $this->events()
            ->where('event', 'page_view')
            ->where(function ($query) {
                $query->where('path', '/explore')->orWhere('path', '/numbers')->orWhere('path', 'like', '/numbers/%')
                    ->orWhere('path', 'like', '/explore/%');
            })->distinct()->count('session_id');
        return ['views' => $views, 'tools' => $rows];
    }

    public function getEditoriaDetails(): array
    {
        $base = $this->events()->where('path', '/editoria');
        $visits = (clone $base)->where('event', 'page_view')->distinct()->count('session_id');
        $clicks = (clone $base)->whereIn('event', ['link_click', 'cta_click'])
            ->selectRaw("COALESCE(NULLIF(element, ''), 'Без названия') as label, COUNT(*) as total, COUNT(DISTINCT session_id) as sessions")
            ->groupByRaw("COALESCE(NULLIF(element, ''), 'Без названия')")
            ->orderByDesc('total')->get();
        $scroll = [];
        foreach ([25,50,75,90,100] as $mark) {
            $count = (clone $base)->where('event', 'scroll_depth')->where('element', 'scroll_'.$mark)
                ->distinct()->count('session_id');
            $scroll[] = ['mark'=>$mark, 'count'=>$count, 'rate'=>$visits ? round($count / $visits * 100, 1) : 0];
        }
        $engagement = [];
        foreach ([10,30,60,120,300] as $seconds) {
            $count = (clone $base)->where('event', 'engagement')->where('element', 'active_'.$seconds)
                ->distinct()->count('session_id');
            $engagement[] = ['seconds'=>$seconds, 'count'=>$count, 'rate'=>$visits ? round($count / $visits * 100, 1) : 0];
        }
        return compact('visits', 'clicks', 'scroll', 'engagement');
    }

    public function getRecentEvents()
    {
        return $this->events()
            ->orderByDesc('occurred_at')->limit(80)
            ->get(['occurred_at', 'event', 'path', 'element', 'device', 'browser', 'visitor_id']);
    }
}
