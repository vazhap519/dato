<x-filament-panels::page>
    <style>
        .sa-dashboard{display:flex;flex-direction:column;gap:24px;color:var(--gray-950,#f8fafc)}
        .sa-dashboard .sa-period{background:#27272a;color:#fafafa;border:1px solid #52525b;border-radius:9px;padding:9px 13px;font-size:13px;cursor:pointer}
        .sa-dashboard .sa-period:focus{outline:2px solid #f59e0b}
        .sa-dashboard .sa-tabs{display:flex;gap:8px;overflow-x:auto;padding:3px 0 6px}
        .sa-dashboard .sa-tab{padding:10px 16px;border-radius:10px;border:1px solid #3f3f46;background:#202025;color:#d4d4d8;font-weight:600;font-size:13px;white-space:nowrap;cursor:pointer}
        .sa-dashboard .sa-tab.active{background:rgba(245,158,11,.15);border-color:#f59e0b;color:#fbbf24}
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
        /* High-contrast palette independent of Filament's uncompiled utility classes */
        .sa-dashboard{color:#e4e4e7}
        .sa-dashboard .sa-card{color:#e4e4e7}
        .sa-dashboard .sa-card .sa-section-title{color:#fafafa}
        .sa-dashboard .sa-card .sa-list-head{color:#e4e4e7}
        .sa-dashboard .sa-card .sa-list-head span:last-child{color:#d4d4d8;font-variant-numeric:tabular-nums}
        .sa-dashboard .sa-card .sa-muted,.sa-dashboard .sa-card p{color:#a1a1aa}
        .sa-dashboard .sa-stat-label{color:#d4d4d8}
        .sa-dashboard .sa-table{color:#e4e4e7;table-layout:auto}
        .sa-dashboard .sa-table th{color:#d4d4d8;background:#222228;position:sticky;top:0;z-index:2}
        .sa-dashboard .sa-table td{color:#e4e4e7}
        .sa-dashboard .sa-table td.sa-dim{color:#b4b4be}
        .sa-dashboard .sa-table td.sa-time{font-variant-numeric:tabular-nums;white-space:nowrap;color:#d4d4d8}
        .sa-dashboard .sa-table tr:nth-child(even) td{background:rgba(255,255,255,.025)}
        .sa-dashboard .sa-table tr:hover td{background:rgba(245,158,11,.07)}
        .sa-dashboard .sa-pill{font-weight:600;color:#e4e4e7;background:#33333d}
        .sa-dashboard .sa-pill.view{background:rgba(56,189,248,.13);color:#7dd3fc}
        .sa-dashboard .sa-pill.link{background:rgba(167,139,250,.15);color:#c4b5fd}
        .sa-dashboard .sa-pill.cta{background:rgba(52,211,153,.14);color:#6ee7b7}
        .sa-dashboard .sa-history{max-height:390px;overflow:auto;overscroll-behavior:contain;scrollbar-color:#52525b transparent}
        .sa-dashboard .sa-table th,.sa-dashboard .sa-table td{padding:8px 10px;line-height:1.3}
        .sa-dashboard .sa-history-summary{display:flex;align-items:center;justify-content:space-between;gap:10px;cursor:pointer;list-style:none}
        .sa-dashboard .sa-history-summary::-webkit-details-marker{display:none}
        .sa-dashboard .sa-history-summary .sa-chevron{color:#fbbf24;font-size:12px}
        .sa-dashboard details[open] .sa-history-summary .sa-chevron{transform:rotate(180deg)}
        .sa-dashboard .sa-history-note{margin-top:5px;font-size:12px;color:#a1a1aa}
        .sa-dashboard .sa-history{margin-top:16px}
        .sa-dashboard .sa-history-summary:focus-visible{outline:2px solid #f59e0b;outline-offset:5px;border-radius:4px}
        @media(prefers-color-scheme:light){
          .sa-dashboard{color:#27272a}
          .sa-dashboard .sa-card{color:#27272a}
          .sa-dashboard .sa-card .sa-section-title,.sa-dashboard .sa-card .sa-list-head{color:#18181b}
          .sa-dashboard .sa-card .sa-list-head span:last-child,.sa-dashboard .sa-stat-label{color:#52525b}
          .sa-dashboard .sa-table,.sa-dashboard .sa-table td{color:#27272a}
          .sa-dashboard .sa-table th{background:#f4f4f5;color:#52525b}
          .sa-dashboard .sa-table td.sa-dim,.sa-dashboard .sa-table td.sa-time{color:#52525b}
          .sa-dashboard .sa-table tr:nth-child(even) td{background:#fafafa}
          .sa-dashboard .sa-pill{background:#e4e4e7;color:#27272a}
        }
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
        $funnel = $this->getFunnel();
        $conversions = $this->getPageConversions();
        $comparison = $this->getComparison();
        $deviceConversions = $this->getDeviceConversions();
        $editoria = $this->tab === 'editoria' ? $this->getEditoriaDetails() : null;
        $maxPage = max(1, (int) ($pages->first()->views ?? 0));
        $maxSource = max(1, (int) ($sources->first()->total ?? 0));
        $maxClick = max(1, (int) ($clicks->first()->total ?? 0));
    @endphp

    <div class="sa-dashboard">
        <div class="sa-header">
            <div>
                <h2 class="sa-title">Обзор активности</h2>
                <p class="sa-muted">Период: {{ match($this->period) { "today" => "сегодня", "yesterday" => "вчера", "7" => "7 дней", default => "30 дней" } }} · Обновляется при открытии страницы</p>
            </div>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
                <label for="sa-period" style="font-size:13px;color:#d4d4d8">Период</label>
                <select id="sa-period" class="sa-period" wire:model.live="period"><option value="today">Сегодня</option><option value="yesterday">Вчера</option><option value="7">7 дней</option><option value="30">30 дней</option></select>
                <a href="/?analytics_ignore=1" target="_blank" rel="noopener noreferrer" class="sa-period" style="text-decoration:none">Не учитывать мой браузер</a>
                <span class="sa-tag">Собственная аналитика сайта</span>
            </div>
        </div>

        <nav class="sa-tabs" aria-label="Разделы аналитики">
            @foreach (['overview'=>'Обзор','visitors'=>'Посетители','conversions'=>'Конверсии','editoria'=>'Практикум /editoria','sources'=>'Источники','history'=>'История'] as $key => $label)
                <button type="button" wire:click="$set('tab', '{{ $key }}')" class="sa-tab {{ $this->tab === $key ? 'active' : '' }}">{{ $label }}</button>
            @endforeach
            <button type="button" wire:click="exportCsv" class="sa-tab" style="margin-left:auto">↓ Скачать CSV</button>
        </nav>
        @if ($this->tab === 'overview')
        <div class="sa-stats">
            @foreach ([
                ['Просмотры страниц', $stats['views'], '◉', 'amber'],
                ['Сеансы вкладок', $stats['visitors'], '▣', 'blue'],
                ['Нажатия', $stats['clicks'], '↗', 'emerald'],
                ['Все события', $stats['events'], '✦', 'violet'],
            ] as [$label, $value, $icon, $color])
                <div class="sa-card">
                    <div class="sa-header">
                        <span class="sa-stat-label">{{ $label }}</span>
                        <span style="font-size:21px;color:#fbbf24;font-weight:700">{{ $icon }}</span>
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
                <span class="rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">{{ match($this->period) { "today"=>"Сегодня", "yesterday"=>"Вчера", "7"=>"7 дней", default=>"30 дней" } }}</span>
            </div>
            <div class="sa-chart">
                @foreach ($daily as $day)
                    <div class="sa-bar-wrap" title="{{ $day['label'] }}: {{ $day['views'] }} просмотров">
                        <div class="sa-bar" style="height: {{ $day['views'] ? max(3, round($day['views'] / $maxDaily * 100)) : 1 }}%"></div>
                        <span class="sa-tooltip">{{ $day['label'] }} · {{ $day['views'] }}</span>
                    </div>
                @endforeach
            </div>
            <div class="sa-axis"><span>{{ $daily[0]['label'] }}</span><span>{{ $daily[count($daily)-1]['label'] }}</span></div>
        </div>

        <div class="sa-card">
            <h3 class="sa-section-title">Сравнение с предыдущим периодом</h3>
            <div class="sa-grid" style="margin-top:15px">
                @foreach (['views'=>'Просмотры','visitors'=>'Сеансы вкладок','clicks'=>'Нажатия'] as $key => $label)
                    <div>
                        <div class="sa-stat-label">{{ $label }}</div>
                        <div class="sa-stat-value">{{ $comparison[$key]['current'] }}</div>
                        <div class="sa-muted">Ранее: {{ $comparison[$key]['previous'] }} · {{ $comparison[$key]['change'] === null ? 'нет базы для сравнения' : (($comparison[$key]['change'] > 0 ? '+' : '') . $comparison[$key]['change'] . '%') }}</div>
                    </div>
                @endforeach
            </div>
        </div>
        @endif
        @if ($this->tab === 'conversions')
        <div class="sa-card">
            <h3 class="sa-section-title">Воронка практикума «Познай СЕБЯ»</h3>
            <p class="sa-muted">Измеряются сеансы вкладок, а не уникальные люди. Подписка и участие пока не подтверждаются сайтом.</p>
            <div class="sa-grid" style="margin-top:18px">
                <div><div class="sa-stat-label">Посетили /editoria</div><div class="sa-stat-value">{{ $funnel['views'] }}</div></div>
                <div><div class="sa-stat-label">Нажали кнопку записи</div><div class="sa-stat-value">{{ $funnel['clicks'] }} <span style="font-size:15px;color:#fbbf24">· {{ $funnel['rate'] }}%</span></div></div>
            </div>
        </div>

        <div class="sa-card">
            <h3 class="sa-section-title">Конверсия ключевых страниц</h3>
            <p class="sa-muted">Доля сеансов с нажатием отслеживаемых элементов. Это не подтверждённые заявки или оплаты.</p>
            <div class="sa-list">
                @foreach ($conversions as $conversion)
                    <div>
                        <div class="sa-list-head"><span>{{ $conversion['label'] }} · {{ $conversion['path'] }}</span><span>{{ $conversion['clicks'] }} из {{ $conversion['views'] }} · {{ $conversion['rate'] }}%</span></div>
                        <div class="sa-track"><div class="sa-fill green" style="width: {{ min(100, $conversion['rate']) }}%"></div></div>
                    </div>
                @endforeach
            </div>
        </div>

        @endif
        @if ($this->tab === 'sources' || $this->tab === 'visitors')
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

        @endif
        @if ($this->tab === 'visitors')
        <div class="sa-card">
            <h3 class="sa-section-title">Конверсия практикума по устройствам</h3>
            <p class="sa-muted">Сеансы страницы /editoria и сеансы с нажатием кнопки записи.</p>
            <div class="sa-list">
                @forelse ($deviceConversions as $item)
                    <div>
                        <div class="sa-list-head"><span>{{ match($item['device']) {'mobile'=>'Телефоны','desktop'=>'Компьютеры','tablet'=>'Планшеты',default=>'Другие'} }}</span><span>{{ $item['clicks'] }} из {{ $item['views'] }} · {{ $item['rate'] }}%</span></div>
                        <div class="sa-track"><div class="sa-fill green" style="width:{{ min(100,$item['rate']) }}%"></div></div>
                    </div>
                @empty <p class="sa-muted">Данных пока нет.</p> @endforelse
            </div>
        </div>
        <div class="sa-card">
            <h3 class="sa-section-title">Новые и вернувшиеся посетители</h3>
            <p class="sa-muted">Недоступно без идентификатора между посещениями. Сейчас учитываются только сеансы вкладок; мы не создаём скрытый отпечаток устройства и не считаем новую вкладку новым человеком.</p>
        </div>
        @endif
        @if ($this->tab === 'editoria')
        <div class="sa-card">
            <h3 class="sa-section-title">Подробная аналитика /editoria</h3>
            <p class="sa-muted">За выбранный период · {{ $editoria['visits'] }} сеансов страницы. Нажатия считаются отдельно по каждому названию кнопки. Прокрутка и активное время собираются только после обновления сайта.</p>
        </div>
        <div class="sa-grid">
            <div class="sa-card">
                <h3 class="sa-section-title">Нажатия на кнопки и ссылки</h3>
                <div class="sa-list">
                    @forelse ($editoria['clicks'] as $click)
                        <div>
                            <div class="sa-list-head"><span title="{{ $click->label }}">{{ $click->label }}</span><span>{{ $click->total }} нажатий · {{ $click->sessions }} сеансов</span></div>
                            <div class="sa-track"><div class="sa-fill purple" style="width:{{ min(100, $editoria['visits'] ? $click->sessions / $editoria['visits'] * 100 : 0) }}%"></div></div>
                        </div>
                    @empty <p class="sa-muted">Пока нет нажатий.</p> @endforelse
                </div>
            </div>
            <div class="sa-card">
                <h3 class="sa-section-title">Глубина прокрутки</h3>
                <p class="sa-muted">Сеансы, достигшие указанной глубины страницы.</p>
                <div class="sa-list">
                    @foreach ($editoria['scroll'] as $item)
                        <div>
                            <div class="sa-list-head"><span>{{ $item['mark'] }}% страницы</span><span>{{ $item['count'] }} сеансов · {{ $item['rate'] }}%</span></div>
                            <div class="sa-track"><div class="sa-fill blue" style="width:{{ min(100,$item['rate']) }}%"></div></div>
                        </div>
                    @endforeach
                </div>
            </div>
            <div class="sa-card">
                <h3 class="sa-section-title">Активное время на странице</h3>
                <p class="sa-muted">Учитывается только время открытой, видимой вкладки. Это не гарантирует, что человек читал текст.</p>
                <div class="sa-list">
                    @foreach ($editoria['engagement'] as $item)
                        <div>
                            <div class="sa-list-head"><span>Не менее {{ $item['seconds'] }} секунд</span><span>{{ $item['count'] }} сеансов · {{ $item['rate'] }}%</span></div>
                            <div class="sa-track"><div class="sa-fill green" style="width:{{ min(100,$item['rate']) }}%"></div></div>
                        </div>
                    @endforeach
                </div>
            </div>
            <div class="sa-card">
                <h3 class="sa-section-title">Как читать результаты</h3>
                <p class="sa-muted">Сравнивай глубину прокрутки с нажатием кнопок. Если до 50% страницы доходят немногие, проверь первый экран и длину текста. Если страницу читают, но не нажимают запись, проверь предложение и призыв к действию.</p>
                <p class="sa-muted" style="margin-top:12px">Показатели основаны на сеансах вкладок, а не на уникальных людях. Старые события без метрик прокрутки не восстанавливаются.</p>
            </div>
        </div>
        @endif
        @if ($this->tab === 'history')
        <details class="sa-card" open>
            <summary class="sa-history-summary">
                <div>
                    <h3 class="sa-section-title">История действий</h3>
                    <p class="sa-history-note">Последние {{ $events->count() }} событий · прокручиваемый журнал</p>
                </div>
                <span class="sa-chevron" aria-hidden="true">▼</span>
            </summary>
            <div class="sa-table-wrap sa-history">
                <table class="sa-table">
                    <thead><tr><th>Время</th><th>Действие</th><th>Страница</th><th>Элемент</th><th>Устройство</th></tr></thead>
                    <tbody>
                        @forelse ($events as $event)
                            <tr>
                                <td class="sa-time">{{ \Illuminate\Support\Carbon::parse($event->occurred_at)->format('d.m H:i:s') }}</td>
                                <td><span class="sa-pill {{ match($event->event) {'page_view'=>'view','link_click'=>'link','cta_click'=>'cta',default=>''} }}">{{ match($event->event) {'page_view'=>'Просмотр','link_click'=>'Ссылка','cta_click'=>'Кнопка',default=>$event->event} }}</span></td>
                                <td>{{ $event->path }}</td>
                                <td class="sa-dim">{{ $event->element ?: '—' }}</td>
                                <td class="sa-dim">{{ $event->device }} / {{ $event->browser }}</td>
                            </tr>
                        @empty <tr><td colspan="5">Событий пока нет.</td></tr> @endforelse
                    </tbody>
                </table>
            </div>
        </details>
        @endif
        <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400">Сеансы вкладок учитываются без повторного подсчёта при обновлении страницы. Открытие новой вкладки или нового сеанса может учитываться отдельно: это не точное число уникальных людей. Для этого используется временный идентификатор в sessionStorage, без постоянных аналитических cookie. Источники переходов могут быть неизвестны, если браузер не передал адрес предыдущего сайта. Кнопка «Не учитывать мой браузер» открывает главную страницу и исключает дальнейшие события этого браузера; вернуть учёт можно по адресу /?analytics_ignore=0.</p>
    </div>
</x-filament-panels::page>
