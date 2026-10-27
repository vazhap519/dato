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
        $query = DB::table('site_analytics_events')->where('occurred_at', '>=', now()->subDays(30));
        return [
            'events' => (clone $query)->count(),
            'views' => (clone $query)->where('event', 'page_view')->count(),
            'visitors' => (clone $query)->distinct('visitor_id')->count('visitor_id'),
            'clicks' => (clone $query)->whereIn('event', ['cta_click', 'link_click'])->count(),
        ];
    }

    public function getPopularPages()
    {
        return DB::table('site_analytics_events')
            ->select('path', DB::raw('COUNT(*) as views'))
            ->where('event', 'page_view')
            ->where('occurred_at', '>=', now()->subDays(30))
            ->groupBy('path')->orderByDesc('views')->limit(15)->get();
    }

    public function getDailyViews(): array
    {
        $rows = DB::table('site_analytics_events')
            ->selectRaw("DATE(occurred_at) as day, COUNT(*) as views")
            ->where('event', 'page_view')
            ->where('occurred_at', '>=', now()->subDays(29)->startOfDay())
            ->groupByRaw('DATE(occurred_at)')
            ->pluck('views', 'day');
        $days = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $days[] = ['date' => $date, 'label' => now()->subDays($i)->format('d.m'), 'views' => (int) ($rows[$date] ?? 0)];
        }
        return $days;
    }

    public function getDevices()
    {
        return DB::table('site_analytics_events')
            ->select('device', DB::raw('COUNT(*) as total'))
            ->where('event', 'page_view')
            ->where('occurred_at', '>=', now()->subDays(30))
            ->groupBy('device')->orderByDesc('total')->get();
    }

    public function getSources()
    {
        return DB::table('site_analytics_events')
            ->selectRaw("COALESCE(NULLIF(utm_source, ''), NULLIF(referrer_host, ''), 'Прямой / неизвестен') as source, COUNT(*) as total")
            ->where('event', 'page_view')
            ->where('occurred_at', '>=', now()->subDays(30))
            ->groupByRaw("COALESCE(NULLIF(utm_source, ''), NULLIF(referrer_host, ''), 'Прямой / неизвестен')")
            ->orderByDesc('total')->limit(8)->get();
    }

    public function getTopClicks()
    {
        return DB::table('site_analytics_events')
            ->select('element', DB::raw('COUNT(*) as total'))
            ->whereIn('event', ['cta_click', 'link_click'])
            ->where('occurred_at', '>=', now()->subDays(30))
            ->whereNotNull('element')
            ->groupBy('element')->orderByDesc('total')->limit(8)->get();
    }

    public function getRecentEvents()
    {
        return DB::table('site_analytics_events')
            ->orderByDesc('occurred_at')->limit(80)
            ->get(['occurred_at', 'event', 'path', 'element', 'device', 'browser', 'visitor_id']);
    }
}
