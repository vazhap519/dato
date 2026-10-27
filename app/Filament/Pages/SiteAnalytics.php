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
        return $this->events()
            ->selectRaw("COALESCE(NULLIF(utm_source, ''), NULLIF(NULLIF(referrer_host, 'arutyun.me'), ''), 'Прямой / неизвестен') as source, COUNT(*) as total")
            ->where('event', 'page_view')
            ->groupByRaw("COALESCE(NULLIF(utm_source, ''), NULLIF(referrer_host, ''), 'Прямой / неизвестен')")
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
        $views = (clone $this->events())->where('event', 'page_view')->where('path', '/editoria')->distinct('session_id')->count('session_id');
        $clicks = (clone $this->events())->where('path', '/editoria')->whereIn('event', ['cta_click','link_click'])->where(function ($query) {
            $query->where('element', 'ilike', '%telegram%')->orWhere('element', 'ilike', '%join%')->orWhere('element', 'ilike', '%register%')->orWhere('element', 'ilike', '%присоедин%');
        })->distinct('session_id')->count('session_id');
        return ['views' => $views, 'clicks' => $clicks, 'rate' => $views ? round($clicks / $views * 100, 1) : 0];
    }

    public function getRecentEvents()
    {
        return $this->events()
            ->orderByDesc('occurred_at')->limit(80)
            ->get(['occurred_at', 'event', 'path', 'element', 'device', 'browser', 'visitor_id']);
    }
}
