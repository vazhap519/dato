<?php
namespace App\Filament\Pages;

use Filament\Pages\Page;
use Illuminate\Support\Facades\DB;

class SiteAnalytics extends Page
{
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-chart-bar';
    protected static ?string $navigationLabel = 'Аналитика сайта';
    protected static ?string $title = 'Аналитика сайта';
    protected static string | \UnitEnum | null $navigationGroup = 'Аналитика';
    protected string $view = 'filament.pages.site-analytics';

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

    public function getRecentEvents()
    {
        return DB::table('site_analytics_events')
            ->orderByDesc('occurred_at')->limit(80)
            ->get(['occurred_at', 'event', 'path', 'element', 'device', 'browser', 'visitor_id']);
    }
}
