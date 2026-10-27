<x-filament-panels::page>
    @php($stats = $this->getStats())
    <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        @foreach (['События' => $stats['events'], 'Просмотры страниц' => $stats['views'], 'Посетители' => $stats['visitors'], 'Нажатия' => $stats['clicks']] as $label => $value)
            <div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ $label }}</div>
                <div class="mt-2 text-3xl font-semibold">{{ number_format($value, 0, ',', ' ') }}</div>
            </div>
        @endforeach
    </div>
    <p class="text-sm text-gray-500 dark:text-gray-400">Период: последние 30 дней. Учитываются только события посетителей, давших согласие на аналитику. IP-адреса не сохраняются в открытом виде.</p>
    <x-filament::section heading="Популярные страницы">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead><tr><th class="p-3 text-left">Страница</th><th class="p-3 text-right">Просмотры</th></tr></thead>
                <tbody>
                @foreach ($this->getPopularPages() as $page)
                    <tr class="border-t border-gray-200 dark:border-gray-700"><td class="p-3">{{ $page->path }}</td><td class="p-3 text-right">{{ $page->views }}</td></tr>
                @endforeach
                </tbody>
            </table>
        </div>
    </x-filament::section>
    <x-filament::section heading="Последние события">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead><tr><th class="p-3 text-left">Время</th><th class="p-3 text-left">Событие</th><th class="p-3 text-left">Страница</th><th class="p-3 text-left">Элемент</th><th class="p-3 text-left">Устройство</th></tr></thead>
                <tbody>
                @foreach ($this->getRecentEvents() as $event)
                    <tr class="border-t border-gray-200 dark:border-gray-700">
                        <td class="p-3 whitespace-nowrap">{{ $event->occurred_at }}</td>
                        <td class="p-3">{{ $event->event }}</td>
                        <td class="p-3">{{ $event->path }}</td>
                        <td class="p-3">{{ $event->element }}</td>
                        <td class="p-3">{{ $event->device }} / {{ $event->browser }}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    </x-filament::section>
</x-filament-panels::page>
