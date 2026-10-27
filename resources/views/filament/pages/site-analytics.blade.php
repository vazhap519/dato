<x-filament-panels::page>
    <style>
        .sa-dashboard{display:flex;flex-direction:column;gap:24px;color:var(--gray-950,#f8fafc)}
        .sa-dashboard .sa-header{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
        .sa-dashboard .sa-title{font-size:20px;font-weight:750;line-height:1.4}
        .sa-dashboard .sa-muted{color:#9ca3af;font-size:13px;line-height:1.6}
        .sa-dashboard .sa-tag{background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.2);color:#fbbf24;border-radius:999px;padding:6px 12px;font-size:12px}
        .sa-dashboard .sa-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
        .sa-dashboard .sa-card{min-width:0;background:#18181b;border:1px solid #303036;border-radius:16px;padding:22px}
        .sa-dashboard .sa-stat-label{font-size:13px;color:#a1a1aa}
        .sa-dashboard .sa-stat-value{font-size:32px;font-weight:750;line-height:1.4;margin-top:14px;color:#fafafa}
        .sa-dashboard .sa-section-title{font-size:16px;font-weight:700;margin-bottom:4px;color:#fafafa}
        .sa-dashboard .sa-chart{height:210px;display:flex;align-items:flex-end;gap:4px;border-bottom:1px solid #3f3f46}
        .sa-dashboard .sa-bar-wrap{position:relative;flex:1;min-width:0;height:100%;display:flex;align-items:flex-end}
        .sa-dashboard .sa-bar{width:100%;background:#f59e0b;border-radius:4px 4px 0 0;min-height:1px}
        .sa-dashboard .sa-tooltip{display:none;position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:#09090b;border:1px solid #52525b;color:#fff;padding:5px 8px;border-radius:6px;white-space:nowrap;font-size:12px;z-index:10}
        .sa-dashboard .sa-bar-wrap:hover .sa-tooltip{display:block}
        .sa-dashboard .sa-axis{display:flex;justify-content:space-between;color:#a1a1aa;font-size:12px;margin-top:10px}
        .sa-dashboard .sa-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
        .sa-dashboard .sa-list{display:flex;flex-direction:column;gap:16px;margin-top:20px}
        .sa-dashboard .sa-list-head{display:flex;justify-content:space-between;gap:12px;font-size:13px;margin-bottom:6px}
        .sa-dashboard .sa-list-head span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .sa-dashboard .sa-track{height:8px;background:#34343b;border-radius:99px;overflow:hidden}
        .sa-dashboard .sa-fill{height:100%;background:#f59e0b;border-radius:99px}
        .sa-dashboard .sa-fill.blue{background:#38bdf8}.sa-dashboard .sa-fill.green{background:#34d399}.sa-dashboard .sa-fill.purple{background:#a78bfa}
        .sa-dashboard .sa-table-wrap{overflow-x:auto;margin-top:16px}
        .sa-dashboard .sa-table{width:100%;border-collapse:collapse;font-size:13px;text-align:left}
        .sa-dashboard .sa-table th{color:#a1a1aa;font-size:12px;font-weight:600;padding:12px;border-bottom:1px solid #3f3f46;white-space:nowrap}
        .sa-dashboard .sa-table td{padding:12px;border-bottom:1px solid #303036;vertical-align:top}
        .sa-dashboard .sa-table tr:hover td{background:rgba(255,255,255,.025)}
        .sa-dashboard .sa-pill{display:inline-block;border-radius:6px;background:#303036;padding:4px 8px;font-size:12px}
        @media(max-width:1100px){.sa-dashboard .sa-stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:760px){.sa-dashboard .sa-grid{grid-template-columns:1fr}.sa-dashboard .sa-card{padding:16px}.sa-dashboard .sa-chart{height:160px}}
        @media(max-width:420px){.sa-dashboard .sa-stats{gap:8px}.sa-dashboard .sa-stat-value{font-size:26px}.sa-dashboard .sa-stat-label{font-size:12px}}
        @media(prefers-color-scheme:light){.sa-dashboard .sa-card{background:#fff;border-color:#e5e7eb}.sa-dashboard .sa-section-title,.sa-dashboard .sa-stat-value{color:#18181b}.sa-dashboard .sa-track{background:#e5e7eb}.sa-dashboard .sa-table td{border-color:#e5e7eb}.sa-dashboard .sa-table th{border-color:#d1d5db}.sa-dashboard .sa-pill{background:#f3f4f6}}
    </style>

    @php
        $stats = $this->getStats();
        $daily = $this->getDailyViews();
        $maxDaily = max(1, max(array_column($daily, 'views')));
        $pages = $this->getPopularPages();
        $devices = $this->getDevices();
        $sources = $this->getSources();
        $clicks = $this->getTopClicks();
        $events = $this->getRecentEvents();
        $maxPage = max(1, (int) ($pages->first()->views ?? 0));
        $maxSource = max(1, (int) ($sources->first()->total ?? 0));
        $maxClick = max(1, (int) ($clicks->first()->total ?? 0));
    @endphp

    <div class="sa-dashboard">
        <div class="sa-header">
            <div>
                <h2 class="sa-title">Обзор активности</h2>
                <p class="sa-muted">Последние 30 дней · Обновляется при открытии страницы</p>
            </div>
            <div class="sa-tag">Собственная аналитика сайта</div>
        </div>

        <div class="sa-stats">
            @foreach ([
                ['Просмотры страниц', $stats['views'], 'visibility', 'amber'],
                ['Сеансы отслеживания', $stats['visitors'], 'group', 'blue'],
                ['Нажатия', $stats['clicks'], 'ads_click', 'emerald'],
                ['Все события', $stats['events'], 'bolt', 'violet'],
            ] as [$label, $value, $icon, $color])
                <div class="sa-card">
                    <div class="sa-header">
                        <span class="sa-stat-label">{{ $label }}</span>
                        <span class="material-symbols-outlined text-xl text-amber-500">{{ $icon }}</span>
                    </div>
                    <div class="sa-stat-value">{{ number_format($value, 0, ',', ' ') }}</div>
                    <div class="mt-2 text-xs text-gray-400">За выбранный период</div>
                </div>
            @endforeach
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900 sm:p-6">
            <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 class="sa-section-title">Динамика посещений</h3>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Просмотры страниц по дням</p>
                </div>
                <span class="rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">30 дней</span>
            </div>
            <div class="sa-chart">
                @foreach ($daily as $day)
                    <div class="sa-bar-wrap" title="{{ $day['label'] }}: {{ $day['views'] }} просмотров">
                        <div class="sa-bar" style="height: {{ $day['views'] ? max(3, round($day['views'] / $maxDaily * 100)) : 1 }}%"></div>
                        <span class="sa-tooltip">{{ $day['label'] }} · {{ $day['views'] }}</span>
                    </div>
                @endforeach
            </div>
            <div class="sa-axis"><span>{{ $daily[0]['label'] }}</span><span>{{ $daily[14]['label'] }}</span><span>{{ $daily[29]['label'] }}</span></div>
        </div>

        <div class="sa-grid">
            <div class="sa-card">
                <h3 class="sa-section-title">Популярные страницы</h3>
                <div class="sa-list">
                    @forelse ($pages->take(8) as $page)
                        <div>
                            <div class="sa-list-head"><span class="truncate font-medium">{{ $page->path }}</span><span class="tabular-nums text-gray-500">{{ $page->views }}</span></div>
                            <div class="sa-track"><div class="sa-fill" style="width: {{ round($page->views / $maxPage * 100) }}%"></div></div>
                        </div>
                    @empty <p class="text-sm text-gray-500">Пока нет просмотров.</p> @endforelse
                </div>
            </div>
            <div class="sa-card">
                <h3 class="sa-section-title">Источники переходов</h3>
                <div class="sa-list">
                    @forelse ($sources as $source)
                        <div>
                            <div class="sa-list-head"><span class="truncate font-medium">{{ $source->source }}</span><span class="tabular-nums text-gray-500">{{ $source->total }}</span></div>
                            <div class="sa-track"><div class="sa-fill blue" style="width: {{ round($source->total / $maxSource * 100) }}%"></div></div>
                        </div>
                    @empty <p class="text-sm text-gray-500">Источники пока неизвестны.</p> @endforelse
                </div>
            </div>
            <div class="sa-card">
                <h3 class="sa-section-title">Устройства</h3>
                @php($totalDevices = max(1, (int) $devices->sum('total')))
                <div class="sa-list">
                    @forelse ($devices as $device)
                        <div>
                            <div class="sa-list-head"><span class="font-medium">{{ match($device->device) {'mobile' => 'Телефоны', 'tablet' => 'Планшеты', 'desktop' => 'Компьютеры', default => 'Другие'} }}</span><span class="text-gray-500">{{ round($device->total / $totalDevices * 100) }}% · {{ $device->total }}</span></div>
                            <div class="sa-track"><div class="sa-fill green" style="width: {{ round($device->total / $totalDevices * 100) }}%"></div></div>
                        </div>
                    @empty <p class="text-sm text-gray-500">Пока нет данных.</p> @endforelse
                </div>
            </div>
            <div class="sa-card">
                <h3 class="sa-section-title">Популярные нажатия</h3>
                <div class="sa-list">
                    @forelse ($clicks as $click)
                        <div>
                            <div class="sa-list-head"><span class="truncate font-medium">{{ $click->element }}</span><span class="tabular-nums text-gray-500">{{ $click->total }}</span></div>
                            <div class="sa-track"><div class="sa-fill purple" style="width: {{ round($click->total / $maxClick * 100) }}%"></div></div>
                        </div>
                    @empty <p class="text-sm text-gray-500">Нажатий пока нет.</p> @endforelse
                </div>
            </div>
        </div>

        <div class="sa-card">
            <div class="mb-4">
                <h3 class="sa-section-title">Журнал активности</h3>
                <p class="mt-1 text-xs text-gray-500">Последние 80 событий · Для технической проверки</p>
            </div>
            <div class="sa-table-wrap">
                <table class="sa-table">
                    <thead class="text-xs uppercase tracking-wide text-gray-500"><tr><th class="px-3 py-3">Время</th><th class="px-3 py-3">Событие</th><th class="px-3 py-3">Страница</th><th class="px-3 py-3">Элемент</th><th class="px-3 py-3">Устройство</th></tr></thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-white/10">
                        @forelse ($events as $event)
                            <tr class="hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                                <td class="whitespace-nowrap px-3 py-3 text-gray-500">{{ $event->occurred_at }}</td>
                                <td class="px-3 py-3"><span class="sa-pill">{{ match($event->event) {'page_view'=>'Просмотр', 'link_click'=>'Ссылка', 'cta_click'=>'Кнопка', default=>$event->event} }}</span></td>
                                <td class="px-3 py-3">{{ $event->path }}</td>
                                <td class="px-3 py-3 text-gray-500">{{ $event->element ?: '—' }}</td>
                                <td class="whitespace-nowrap px-3 py-3 text-gray-500">{{ $event->device }} / {{ $event->browser }}</td>
                            </tr>
                        @empty <tr><td colspan="5" class="px-3 py-8 text-center text-gray-500">Событий пока нет.</td></tr> @endforelse
                    </tbody>
                </table>
            </div>
        </div>
        <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400">Показатель сеансов отражает временные идентификаторы загрузок страниц, а не уникальных людей. Собственная аналитика работает без постоянных аналитических cookie. Источники переходов могут быть неизвестны, если браузер не передал адрес предыдущего сайта.</p>
    </div>
</x-filament-panels::page>
