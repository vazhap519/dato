import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import dataBase from '../../data/pattern-atlas.json';
import { liveExploreDocument } from '../lib/exploreCms.js';

const data = liveExploreDocument('pattern-atlas', dataBase);
const kicker='text-xs font-semibold uppercase tracking-[.18em] text-[#f0c453]';
const panel='rounded-3xl border border-[#84683f]/70 bg-[#211d15] p-6 sm:p-8';
export default function ExplorePatternDetail(){
  const {patternSlug,settings={}}=usePage().props;
  const pattern=data.patterns.find(p=>p.slug===patternSlug);
  if(!pattern)return null;
  const category=data.categories.find(c=>c.id===pattern.category);
  const related=data.patterns.filter(p=>p.category===pattern.category&&p.slug!==pattern.slug);
  return <div data-no-analytics className="min-h-screen bg-[#14120d] text-[#f8f4e9]">
    <Head title={pattern.title+' — Язык повторений — Arutyun'}><meta name="description" content={pattern.pattern}/></Head>
    <header className="border-b border-[#b99347]/25"><div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-5">
      <Link href="/" aria-label="На главную">{settings?.logo?<img src={settings.logo} alt="Arutyun" className="h-10 max-w-[160px] object-contain"/>:<span className="font-serif text-2xl italic text-[#f0c453]">Arutyun</span>}</Link>
      <Link href="/explore/patterns#library" className="text-sm text-[#e4c88c] hover:text-white">← Все повторения</Link>
    </div></header>
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-12 sm:pt-16">
      <p className={kicker}>{category?.title} · Библиотека повторений</p>
      <h1 className="mt-4 font-serif text-4xl sm:text-6xl">{pattern.title}</h1>
      <p className="mt-4 font-serif text-2xl italic text-[#e5bc62]">{pattern.pattern}</p>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-[#d4c6b2]">Этот сценарий — возможная привычная реакция, а не тип личности. Один пример не означает, что он описывает тебя целиком.</p>
      <section className="mt-10 rounded-3xl border border-[#ab844c]/70 bg-gradient-to-br from-[#362919] to-[#211d15] p-6 sm:p-9">
       <p className={kicker}>Знакомая ситуация</p>
       <h2 className="mt-3 font-serif text-3xl">Как это может выглядеть</h2>
       <p className="mt-5 text-lg leading-8 text-[#e7d9c4]">{pattern.scene}</p>
       <div className="mt-6 rounded-2xl border border-[#725a3b] bg-[#17140f] p-5">
        <p className={kicker}>Внутренний голос</p><p className="mt-3 leading-7">{pattern.automatic}</p>
       </div>
      </section>
      <section className="mt-12 grid gap-5 md:grid-cols-2">
        <div className={panel}><p className={kicker}>Что помогает</p><h2 className="mt-3 font-serif text-3xl">В чём польза реакции?</h2><p className="mt-5 leading-8 text-[#e0d1ba]">{pattern.gift}</p><p className="mt-4 text-sm leading-7 text-[#bcae98]">Реакция могла возникнуть как способ справиться с реальной сложностью — не нужно её ненавидеть.</p></div>
        <div className={panel}><p className={kicker}>Когда ограничивает</p><h2 className="mt-3 font-serif text-3xl">Какая возможна цена?</h2><p className="mt-5 leading-8 text-[#e0d1ba]">{pattern.cost}</p><p className="mt-4 text-sm leading-7 text-[#bcae98]">Проверь эту гипотезу на фактах, а не считай её обязательной правдой о себе.</p></div>
      </section>
      <section className="mt-12">
        <p className={kicker}>Три точки внимания</p>
        <h2 className="mt-3 font-serif text-3xl">Вопросы к себе</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">{pattern.questions.map((q,i)=><div key={i} className={panel}><p className="font-serif text-3xl text-[#f0c453]">{i+1}</p><p className="mt-4 leading-7 text-[#e0d1ba]">{q}</p></div>)}</div>
      </section>
      <section className="mt-12 rounded-3xl border border-[#ad8a4c]/70 bg-[#2d2318] p-6 sm:p-9">
        <p className={kicker}>Маленький альтернативный шаг</p>
        <h2 className="mt-3 font-serif text-3xl">Что попробовать иначе?</h2>
        <p className="mt-5 text-lg leading-8 text-[#f1e0c5]">{pattern.experiment}</p>
        <p className="mt-4 text-sm leading-7 text-[#c4b49c]">Эксперимент необязателен. Важно учитывать собственную безопасность, обстоятельства и границы других.</p>
        <Link href="/explore/patterns#map" className="mt-6 inline-block rounded-xl bg-[#f0c453] px-5 py-3 text-sm font-semibold text-[#21180b]">Исследовать свою ситуацию →</Link>
      </section>
      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <div className={panel}><h3 className="font-serif text-2xl">Повторилось — не значит «сам виноват»</h3><p className="mt-4 text-sm leading-7 text-[#c4b9a6]">На ситуацию могут влиять чужие действия, обстоятельства и условия жизни. Нельзя объяснять все трудности только внутренними установками.</p></div>
        <div className={panel}><h3 className="font-serif text-2xl">Сначала безопасность</h3><p className="mt-4 text-sm leading-7 text-[#c4b9a6]">Если речь об угрозе, насилии или принуждении, не пробуй менять реакцию ценой риска. Обращайся за поддержкой и безопасной помощью.</p></div>
      </section>
      <section className="mt-14"><p className={kicker}>Похожие темы</p><h2 className="mt-3 font-serif text-3xl">Другие сценарии</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">{related.map(p=><Link key={p.slug} href={'/explore/patterns/'+p.slug} className="rounded-2xl border border-[#84683f] bg-[#211d15] p-5 transition hover:border-[#f0c453]"><h3 className="font-serif text-xl">{p.title}</h3><p className="mt-2 text-sm text-[#bcaf98]">{p.pattern}</p><span className="mt-3 inline-block text-sm text-[#f0c453]">Исследовать →</span></Link>)}</div>
      </section>
      <div className="mt-14 border-t border-[#84683e]/50 pt-9 text-center"><p className="font-serif text-2xl">Ты больше привычного способа реагировать.</p><p className="mt-3 text-sm text-[#aa9b83]">{data.intro}</p><Link href="/explore/patterns#library" className="mt-5 inline-block rounded-xl bg-[#f0c453] px-6 py-3 text-sm font-semibold text-[#21180b]">Другие сценарии →</Link></div>
    </main>
  </div>;
}
