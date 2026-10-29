import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import data from '../../data/dream-atlas.json';

const symbolMap=Object.fromEntries(data.symbols.map(x=>[x.slug,x]));
const kicker='text-xs font-semibold uppercase tracking-[.17em] text-[#f0c453]';
const panel='rounded-2xl border border-[#806638]/65 bg-[#211d15] p-5 sm:p-7';

export default function ExploreDreamSymbol(){
  const { dreamSymbol, settings={} }=usePage().props;
  const symbol=symbolMap[dreamSymbol];
  if(!symbol)return null;
  const group=data.groups.find(x=>x.id===symbol.group);
  const related=data.symbols.filter(x=>x.group===symbol.group&&x.slug!==symbol.slug).slice(0,3);
  return <div data-no-analytics className="min-h-screen bg-[#14120d] text-[#f8f4e9]">
    <Head title={symbol.name+' — Язык снов — Arutyun'}><meta name="description" content={symbol.description}/></Head>
    <header className="border-b border-[#b99347]/25"><div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-5">
      <Link href="/" aria-label="На главную">{settings?.logo?<img src={settings.logo} className="h-10 max-w-[160px] object-contain" alt="Arutyun"/>:<span className="font-serif text-2xl italic text-[#f0c453]">Arutyun</span>}</Link>
      <Link href="/explore/dreams#symbols" className="text-sm text-[#e4c88c] hover:text-white">← Все образы снов</Link>
    </div></header>
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-12 sm:pt-16">
      <p className={kicker}>{group?.name} · Язык снов</p>
      <div className="mt-5 flex flex-wrap items-start gap-6">
        <div className="rounded-3xl border border-[#b18b49] bg-[#2d2519] p-5"><span aria-hidden="true" className="material-symbols-outlined text-6xl text-[#f0c453]">{symbol.icon}</span></div>
        <div className="max-w-3xl flex-1"><h1 className="font-serif text-5xl sm:text-6xl">{symbol.name}</h1><p className="mt-3 font-serif text-2xl italic text-[#e9bd63]">{symbol.subtitle}</p><p className="mt-5 text-lg leading-8 text-[#e2d5c1]">{symbol.description}</p></div>
      </div>
      <p className="mt-7 max-w-3xl text-sm leading-7 text-[#b2a48b]">Это не предсказание и не универсальная расшифровка. Один и тот же образ может вызывать разные ассоциации у разных людей.</p>
      <section className="mt-12">
        <p className={kicker}>Не сам образ, а твоё переживание</p>
        <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Каким он был для тебя?</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {symbol.feelings.map((f,i)=><div key={f} className={panel}><p className="text-xs uppercase tracking-widest text-[#e5bc62]">Возможное ощущение {i+1}</p><p className="mt-3 font-serif text-2xl">{f}</p><p className="mt-3 text-xs leading-6 text-[#b4a68f]">Возможно, твоё чувство было совсем другим — и это тоже важно.</p></div>)}
        </div>
      </section>
      <section className="mt-12 rounded-3xl border border-[#a58045]/70 bg-gradient-to-br from-[#322717] to-[#1b1814] p-6 sm:p-9">
        <p className={kicker}>Пример сновидения</p>
        <h2 className="mt-3 font-serif text-3xl">Образ в истории</h2>
        <p className="mt-5 text-lg leading-8 text-[#f0e2cf]">{symbol.example.dream}</p>
        <div className="mt-6 rounded-2xl border border-[#7e633d]/70 bg-[#17140f]/70 p-5"><p className={kicker}>Другой способ взглянуть</p><p className="mt-3 leading-8 text-[#ded0b9]">{symbol.example.reflection}</p></div>
      </section>
      <section className="mt-12">
        <p className={kicker}>Вопросы без готового ответа</p>
        <h2 className="mt-3 font-serif text-3xl">Три точки внимания</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {symbol.questions.map((q,i)=><div key={i} className={panel}><p className="font-serif text-3xl text-[#f0c453]">{String(i+1).padStart(2,'0')}</p><p className="mt-4 leading-7 text-[#e0d4c1]">{q}</p></div>)}
        </div>
      </section>
      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <div className={panel}><p className={kicker}>Что можно сделать</p><h2 className="mt-3 font-serif text-2xl">Мини-практика</h2><p className="mt-4 text-sm leading-7 text-[#d2c4ad]">Попробуй мысленно восстановить один эпизод сна, назвать свою первую эмоцию и найти одно реальное воспоминание, с которым связался образ. Этого достаточно — не нужно придумывать судьбоносный смысл.</p></div>
        <div className={panel}><p className={kicker}>Где граница толкования</p><h2 className="mt-3 font-serif text-2xl">Сон не инструкция</h2><p className="mt-4 text-sm leading-7 text-[#d2c4ad]">Не принимай решения об отношениях, здоровье, деньгах или безопасности только на основе содержания сна. Если тревожные сны нарушают отдых, полезно обратиться за профессиональной поддержкой.</p></div>
      </section>
      {related.length>0&&<section className="mt-14"><p className={kicker}>Рядом в библиотеке</p><h2 className="mt-3 font-serif text-3xl">Другие образы</h2><div className="mt-6 grid gap-3 sm:grid-cols-3">{related.map(x=><Link key={x.slug} href={'/explore/dreams/'+x.slug} className="rounded-2xl border border-[#84683e]/70 bg-[#211d15] p-5 transition hover:border-[#f0c453]"><span aria-hidden="true" className="material-symbols-outlined text-3xl text-[#f0c453]">{x.icon}</span><p className="mt-3 font-serif text-2xl">{x.name}</p><p className="mt-2 text-sm text-[#c1b09a]">{x.subtitle}</p><span className="mt-3 inline-block text-xs text-[#f0c453]">Исследовать →</span></Link>)}</div></section>}
      <div className="mt-14 border-t border-[#84683e]/50 pt-9 text-center"><p className="font-serif text-2xl">Тебе не нужно знать, что «предвещает» сон, чтобы услышать собственный вопрос.</p><Link href="/explore/dreams#explorer" className="mt-5 inline-block rounded-xl bg-[#f0c453] px-6 py-3 text-sm font-semibold text-[#21180b]">Исследовать другой сон →</Link></div>
    </main>
  </div>;
}
