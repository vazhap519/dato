<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
class SiteAnalyticsController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'visitor_id' => ['required', 'uuid'],
            'session_id' => ['required', 'uuid'],
            'event' => ['required', 'in:page_view,cta_click,link_click,scroll_depth,engagement'],
            'path' => ['required', 'string', 'max:500', 'starts_with:/'],
            'element' => ['nullable', 'string', 'max:120'],
            'referrer_host' => ['nullable', 'string', 'max:255'],
            'utm_source' => ['nullable', 'string', 'max:120'],
            'utm_medium' => ['nullable', 'string', 'max:120'],
            'utm_campaign' => ['nullable', 'string', 'max:120'],
        ]);
        $agent = Str::lower($request->userAgent() ?? '');
        $browser = str_contains($agent, 'edg/') ? 'Edge' : (str_contains($agent, 'firefox/') ? 'Firefox' : (str_contains($agent, 'chrome/') ? 'Chrome' : (str_contains($agent, 'safari/') ? 'Safari' : 'Other')));
        $device = preg_match('/mobile|android|iphone/', $agent) ? 'mobile' : (str_contains($agent, 'ipad') || str_contains($agent, 'tablet') ? 'tablet' : 'desktop');
        if (in_array($data['event'], ['scroll_depth', 'engagement'], true) && $data['path'] !== '/editoria') return response()->noContent();
        DB::table('site_analytics_events')->insert([
            ...$data,
            'path' => strtok($data['path'], '?') ?: '/',
            'browser' => $browser,
            'device' => $device,
            'ip_hash' => null,
            'occurred_at' => now(),
        ]);
        return response()->noContent();
    }
}
