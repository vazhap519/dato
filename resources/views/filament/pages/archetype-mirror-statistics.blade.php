<x-filament-panels::page>
    @php($report = $this->getReport())

    <style>
        .am-dashboard { display:flex; flex-direction:column; gap:22px; color:var(--fi-text,inherit); }
        .am-dashboard .am-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px; }
        .am-dashboard .am-subtitle { font-size:13px; opacity:.75; line-height:1.6; margin-top:6px; }
        .am-dashboard .am-period { border:1px solid #977438; border-radius:10px; padding:9px 14px; color:#f5d58c; background:#27221a; font-size:14px; }
        .am-dashboard .am-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
        .am-dashboard .am-card { border:1px solid rgba(178,140,67,.3); background:rgba(138,108,50,.065); border-radius:16px; padding:20px; min-width:0; }
        .am-dashboard .am-stat { font-size:clamp(28px,4vw,42px); font-weight:750; line-height:1.2; margin:7px 0; color:#ca983c; }
        .am-dashboard .am-section-title { font-size:19px; font-weight:700; margin:0 0 10px; }
        .am-dashboard .am-question-title { font-size:15px; line-height:1.6; font-weight:650; margin:0 0 20px; }
        .am-dashboard .am-question-number { font-size:11px; letter-spacing:.12em; font-weight:700; color:#c29541; margin-bottom:10px; }
        .am-dashboard .am-options { display:flex; flex-direction:column; gap:15px; }
        .am-dashboard .am-answer-meta { display:flex; justify-content:space-between; gap:14px; font-size:13px; margin-bottom:7px; line-height:1.5; }
        .am-dashboard .am-answer-meta strong { white-space:nowrap; font-weight:700; font-variant-numeric:tabular-nums; }
        .am-dashboard .am-track { width:100%; height:9px; border-radius:50px; overflow:hidden; background:rgba(136,128,112,.2); }
        .am-dashboard .am-fill { height:100%; background:linear-gradient(90deg,#805c29,#d4a64f); border-radius:50px; }
        .am-dashboard .am-list { display:flex; flex-direction:column; gap:14px; }
        .am-dashboard .am-chip { display:inline-block; padding:4px 8px; border-radius:6px; background:rgba(184,139,55,.12); color:#be8c2f; font-size:11px; font-weight:700; }
        .am-dashboard .am-role-row { display:grid; grid-template-columns:minmax(0,1.6fr) minmax(100px,1fr); gap:12px; align-items:center; }
        .am-dashboard .am-label { font-size:14px; font-weight:650; }
        .am-dashboard .am-muted { opacity:.68; font-size:12px; line-height:1.6; }
        .am-dashboard .am-role-right { text-align:right; font-variant-numeric:tabular-nums; font-size:13px; white-space:nowrap; }
        .am-dashboard .am-rule { border-top:1px solid rgba(178,140,67,.2); padding-top:13px; }
        .am-dashboard .am-top-choice { line-height:1.5; font-size:13px; }
        .am-dashboard .am-questions { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
        @media(max-width:940px) { .am-dashboard .am-grid,.am-dashboard .am-questions { grid-template-columns:1fr; } }
        @media(max-width:600px) { .am-dashboard .am-card { padding:16px; } .am-dashboard .am-role-row { grid-template-columns:1fr; gap:7px; } .am-dashboard .am-role-right { text-align:left; white-space:normal; } }
        @media(prefers-color-scheme:light) { .am-dashboard .am-period { background:#fff8e6; color:#694612; } }
    </style>

    <div class="am-dashboard">
        <div class="am-header">
            <div>
                <h2 class="am-section-title">Что выбирают посетители?</h2>
                <p class="am-subtitle">Только завершённые исследования с добровольным согласием на общую статистику. Личные анкеты не сохраняются.</p>
            </div>
            <label>
                <span class="sr-only">Период статистики</span>
                <select wire:model.live="period" class="am-period">
                    <option value="today">Сегодня</option>
                    <option value="7">Последние 7 дней</option>
                    <option value="30">Последние 30 дней</option>
                    <option value="all">За всё время</option>
                </select>
            </label>
        </div>

        <div class="am-grid">
            <div class="am-card">
                <p class="am-muted">Учтённых завершённых прохождений</p>
                <div class="am-stat">{{ number_format($report['completions'], 0, ',', ' ') }}</div>
                <p class="am-muted">Это количество отправленных результатов, а не уникальных людей.</p>
            </div>
            <div class="am-card">
                <p class="am-muted">Вопросов в исследовании</p>
                <div class="am-stat">{{ count($report['questions']) }}</div>
                <p class="am-muted">Версия {{ $report['version'] }} · каждый вопрос имеет четыре варианта ответа</p>
            </div>
        </div>

        @if($report['completions'] === 0)
            <div class="am-card">
                <h3 class="am-section-title">Данных пока нет</h3>
                <p class="am-subtitle">Как только посетители завершат «Зеркало архетипов» и добровольно разрешат участие в статистике, здесь появятся диаграммы. Уже пройденные тесты задним числом не учитываются.</p>
            </div>
        @else
            <div class="am-grid">
                <section class="am-card" aria-labelledby="am-roles-heading">
                    <h3 id="am-roles-heading" class="am-section-title">Какие архетипы проявляются чаще</h3>
                    <p class="am-subtitle">Частота выбора = доля ответов в тех ситуациях, где этот архетип вообще был среди вариантов. Это не научная диагностика.</p>
                    <div class="am-list" style="margin-top:22px;">
                        @foreach($report['roles'] as $role)
                            <div class="am-rule">
                                <div class="am-answer-meta">
                                    <span class="am-label">{{ $role['title'] }}</span>
                                    <strong>{{ $role['selection_rate'] }}%</strong>
                                </div>
                                <div class="am-track"><div class="am-fill" style="width:{{ min(100, max(0, $role['selection_rate'])) }}%"></div></div>
                                <p class="am-muted" style="margin-top:7px;">{{ $role['votes'] }} выборов · вариант встречается в {{ $role['appearances'] }} из 20 ситуаций · лидирует в {{ $role['first_place'] }} результатах ({{ $role['first_place_rate'] }}%)</p>
                            </div>
                        @endforeach
                    </div>
                </section>
                <section class="am-card" aria-labelledby="am-popular-heading">
                    <h3 id="am-popular-heading" class="am-section-title">5 самых популярных ответов</h3>
                    <p class="am-subtitle">Доля внутри соответствующего вопроса, а не среди всех 80 вариантов сразу.</p>
                    <div class="am-list" style="margin-top:22px;">
                        @foreach($report['popular'] as $item)
                            <div class="am-rule">
                                <div class="am-question-number">СИТУАЦИЯ {{ str_pad($item['question'], 2, '0', STR_PAD_LEFT) }}</div>
                                <p class="am-muted" style="margin-bottom:6px;">{{ $item['question_text'] }}</p>
                                <div class="am-answer-meta am-top-choice">
                                    <span>{{ $item['label'] }}</span>
                                    <strong>{{ $item['percentage'] }}%</strong>
                                </div>
                                <div class="am-track"><div class="am-fill" style="width:{{ min(100, max(0, $item['percentage'])) }}%"></div></div>
                                <p class="am-muted" style="margin-top:6px;">Выбрано {{ $item['count'] }} раз</p>
                            </div>
                        @endforeach
                    </div>
                </section>
            </div>
        @endif

        <section aria-labelledby="am-all-questions">
            <h3 id="am-all-questions" class="am-section-title" style="margin-bottom:6px;">Ответы на все 20 ситуаций</h3>
            <p class="am-subtitle" style="margin-bottom:18px;">Распределение ответов в завершённых исследованиях за выбранный период.</p>
            <div class="am-questions">
                @foreach($report['questions'] as $question)
                    <article class="am-card">
                        <div class="am-question-number">СИТУАЦИЯ {{ str_pad($question['number'], 2, '0', STR_PAD_LEFT) }} · {{ $question['votes'] }} ответов</div>
                        <h4 class="am-question-title">{{ $question['title'] }}</h4>
                        <div class="am-options">
                            @foreach($question['options'] as $option)
                                <div>
                                    <div class="am-answer-meta">
                                        <span><span class="am-chip">{{ chr(65 + $option['index']) }}</span> {{ $option['label'] }}</span>
                                        <strong>{{ $option['percentage'] }}% · {{ $option['count'] }}</strong>
                                    </div>
                                    <div class="am-track"><div class="am-fill" style="width:{{ min(100, max(0, $option['percentage'])) }}%"></div></div>
                                </div>
                            @endforeach
                        </div>
                    </article>
                @endforeach
            </div>
        </section>
        <p class="am-muted">Статистика начинает собираться с момента установки обновления. Повторные прохождения могут учитываться как отдельные результаты; проценты показывают тенденции среди добровольно поделившихся ответами, а не распределение личностей всей аудитории.</p>
    </div>
</x-filament-panels::page>
