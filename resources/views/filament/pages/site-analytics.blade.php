<x-filament-panels::page>
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

    <div class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 class="text-xl font-bold text-gray-950 dark:text-white">Обзор активности</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Последние 30 дней · Обновляется при открытии страницы</p>
            </div>
            <div class="rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400">Собственная аналитика сайта</div>
        </div>

        <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
            @foreach ([
                ['Просмотры страниц', $stats['views'], 'visibility', 'amber'],
                ['Сеансы отслеживания', $stats['visitors'], 'group', 'blue'],
                ['Нажатия', $stats['clicks'], 'ads_click', 'emerald'],
                ['Все события', $stats['events'], 'bolt', 'violet'],
            ] as [$label, $value, $icon, $color])
                <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900">
                    <div class="mb-4 flex items-center justify-between gap-2">
                        <span class="text-sm text-gray-500 dark:text-gray-400">{{ $label }}</span>
                        <span class="material-symbols-outlined text-xl text-amber-500">{{ $icon }}</span>
                    </div>
                    <div class="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">{{ number_format($value, 0, ',', ' ') }}</div>
                    <div class="mt-2 text-xs text-gray-400">За выбранный период</div>
                </div>
            @endforeach
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900 sm:p-6">
            <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 class="text-base font-semibold text-gray-950 dark:text-white">Динамика посещений</h3>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Просмотры страниц по дням</p>
                </div>
                <span class="rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">30 дней</span>
            </div>
            <div class="flex h-52 items-end gap-1 border-b border-gray-200 pb-1 dark:border-white/10">
                @foreach ($daily as $day)
                    <div class="group relative flex h-full min-w-0 flex-1 items-end" title="{{ $day['label'] }}: {{ $day['views'] }} просмотров">
                        <div class="w-full rounded-t bg-amber-500/75 transition hover:bg-amber-400" style="height: {{ $day['views'] ? max(3, round($day['views'] / $maxDaily * 100)) : 1 }}%"></div>
                        <span class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-950 px-2 py-1 text-xs text-white shadow-lg group-hover:block">{{ $day['label'] }} · {{ $day['views'] }}</span>
                    </div>
                @endforeach
            </div>
            <div class="mt-2 flex justify-between text-xs text-gray-400"><span>{{ $daily[0]['label'] }}</span><span>{{ $daily[14]['label'] }}</span><span>{{ $daily[29]['label'] }}</span></div>
        </div>

        <div class="grid gap-5 xl:grid-cols-2">
            <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-gray-900 sm:p-6">
                <h3 class="mb-5 text-base font-semibold">Популярные страницы</h3>
                <div class="space-y-4">
                    @forelse ($pages->take(8) as $page)
                        <div>
                            <div class="mb-1.5 flex justify-between gap-3 text-sm"><span class="truncate font-medium">{{ $page->path }}</span><span class="tabular-nums text-gray-500">{{ $page->views }}</span></div>
                            <div class="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10"><div class="h-full rounded-full bg-amber-500" style="width: {{ round($page->views / $maxPage * 100) }}%"></div></div>
                        </div>
                    @empty <p class="text-sm text-gray-500">Пока нет просмотров.</p> @endforelse
                </div>
            </div>
            <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-gray-900 sm:p-6">
                <h3 class="mb-5 text-base font-semibold">Источники переходов</h3>
                <div class="space-y-4">
                    @forelse ($sources as $source)
                        <div>
                            <div class="mb-1.5 flex justify-between gap-3 text-sm"><span class="truncate font-medium">{{ $source->source }}</span><span class="tabular-nums text-gray-500">{{ $source->total }}</span></div>
                            <div class="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10"><div class="h-full rounded-full bg-sky-500" style="width: {{ round($source->total / $maxSource * 100) }}%"></div></div>
                        </div>
                    @empty <p class="text-sm text-gray-500">Источники пока неизвестны.</p> @endforelse
                </div>
            </div>
            <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-gray-900 sm:p-6">
                <h3 class="mb-5 text-base font-semibold">Устройства</h3>
                @php($totalDevices = max(1, (int) $devices->sum('total')))
                <div class="space-y-4">
                    @forelse ($devices as $device)
                        <div>
                            <div class="mb-1.5 flex justify-between gap-3 text-sm"><span class="font-medium">{{ match($device->device) {'mobile' => 'Телефоны', 'tablet' => 'Планшеты', 'desktop' => 'Компьютеры', default => 'Другие'} }}</span><span class="text-gray-500">{{ round($device->total / $totalDevices * 100) }}% · {{ $device->total }}</span></div>
                            <div class="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10"><div class="h-full rounded-full bg-emerald-500" style="width: {{ round($device->total / $totalDevices * 100) }}%"></div></div>
                        </div>
                    @empty <p class="text-sm text-gray-500">Пока нет данных.</p> @endforelse
                </div>
            </div>
            <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-gray-900 sm:p-6">
                <h3 class="mb-5 text-base font-semibold">Популярные нажатия</h3>
                <div class="space-y-4">
                    @forelse ($clicks as $click)
                        <div>
                            <div class="mb-1.5 flex justify-between gap-3 text-sm"><span class="truncate font-medium">{{ $click->element }}</span><span class="tabular-nums text-gray-500">{{ $click->total }}</span></div>
                            <div class="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10"><div class="h-full rounded-full bg-violet-500" style="width: {{ round($click->total / $maxClick * 100) }}%"></div></div>
                        </div>
                    @empty <p class="text-sm text-gray-500">Нажатий пока нет.</p> @endforelse
                </div>
            </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-gray-900 sm:p-6">
            <div class="mb-4">
                <h3 class="text-base font-semibold">Журнал активности</h3>
                <p class="mt-1 text-xs text-gray-500">Последние 80 событий · Для технической проверки</p>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="text-xs uppercase tracking-wide text-gray-500"><tr><th class="px-3 py-3">Время</th><th class="px-3 py-3">Событие</th><th class="px-3 py-3">Страница</th><th class="px-3 py-3">Элемент</th><th class="px-3 py-3">Устройство</th></tr></thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-white/10">
                        @forelse ($events as $event)
                            <tr class="hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                                <td class="whitespace-nowrap px-3 py-3 text-gray-500">{{ $event->occurred_at }}</td>
                                <td class="px-3 py-3"><span class="rounded-md bg-gray-100 px-2 py-1 text-xs dark:bg-white/10">{{ match($event->event) {'page_view'=>'Просмотр', 'link_click'=>'Ссылка', 'cta_click'=>'Кнопка', default=>$event->event} }}</span></td>
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
