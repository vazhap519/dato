import React, { useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import data from '../../data/pattern-atlas.json';

const patterns=data.patterns;
const categories=data.categories;
const kicker='text-xs font-semibold uppercase tracking-[.18em] text-[#f0c453]';
const panel='rounded-2xl border border-[#84683f]/70 bg-[#211d15] p-5 sm:p-7';
const outcomes=[
{slug:"tension",title:"Снова напряжение",summary:"Реакция могла защитить от неприятного момента, но оставила нерешённый вопрос."},
{slug:"distance",title:"Отдаление или молчание",summary:"Возможно, важная потребность так и осталась невыраженной."},
{slug:"relief",title:"Короткое облегчение",summary:"Иногда привычная реакция помогает сейчас, но через время возвращает прежнюю сложность."},
{slug:"choice",title:"Появилась ясность",summary:"Иногда привычный сценарий работает — важно заметить и это, не искать проблему любой ценой."}
];
export default function ExplorePatterns() {
 const {settings={}}=usePage().props;
 const [category,setCategory]=useState('all');
 const [query,setQuery]=useState('');
 const [expanded,setExpanded]=useState(false);
 const [chosen,setChosen]=useState('');
 const [outcome,setOutcome]=useState('');
 const [step,setStep]=useState(0);
 const [openPattern,setOpenPattern]=useState(null);
 const filtered=useMemo(()=>patterns.filter(p=>(category==='all'||p.category===category)&&[p.title,p.pattern,p.scene].join(' ').toLowerCase().includes(query.toLowerCase().trim())),[category,query]);
 const listed=expanded||category!=='all'||query.trim()?filtered:filtered.slice(0,9);
 const picked=patterns.find(p=>p.slug===chosen);
 const result=outcomes.find(o=>o.slug===outcome);
 const now=new Date();
 const day=Math.floor(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())/86400000);
 const daily=patterns[day%patterns.length];
 const reset=()=>{setStep(0);setChosen('');setOutcome('');};
 return <div data-no-analytics className="min-h-screen bg-[#14120d] text-[#f8f4e9]">
  <Head title="Язык повторений — замечай привычные сценарии — Arutyun"><meta name="description" content="18 повторяющихся сценариев и интерактивная карта реакции, последствия и нового выбора. Без предсказаний, регистрации и личного журнала."/></Head>
  <header className="border-b border-[#b99347]/25"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
   <Link href="/" aria-label="На главную">{settings?.logo?<img src={settings.logo} alt="Arutyun" className="h-10 max-w-[160px] object-contain"/>:<span className="font-serif text-2xl italic text-[#f0c453]">Arutyun</span>}</Link>
   <nav className="flex flex-wrap items-center gap-4 text-sm" aria-label="Навигация по странице">
    <a href="#map" className="text-[#e4c88c] hover:text-white">Карта сценария</a>
    <a href="#library" className="text-[#e4c88c] hover:text-white">Повторения</a>
    <a href="#daily" className="text-[#e4c88c] hover:text-white">Эксперимент дня</a>
    <a href="#understand" className="text-[#e4c88c] hover:text-white">Как замечать</a>
    <Link href="/explore" className="text-[#b9a98e] hover:text-white">Все направления →</Link>
   </nav>
  </div></header>
  <main className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:pt-16">
   <section className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
    <div>
     <p className={kicker}>Пространство самопознания</p>
     <h1 className="mt-4 font-serif text-5xl sm:text-6xl">Язык <span className="italic text-[#f0c453]">повторений</span></h1>
     <p className="mt-6 max-w-3xl text-lg leading-8 text-[#dbceb9]">Почему в разных обстоятельствах мы снова поступаем знакомым образом? Иногда повторяются не сами события, а наши ответы на них: молчание, спешка, помощь без просьбы или страх ошибиться.</p>
     <p className="mt-4 max-w-3xl leading-7 text-[#b7a890]">Повторение — не судьба и не знак свыше. Это возможность заметить последовательность: ситуация → мысль → действие → последствия → новый выбор.</p>
     <div className="mt-7 flex flex-wrap gap-3">
       <a href="#map" className="rounded-xl bg-[#f0c453] px-6 py-3 font-semibold text-[#21180b] hover:bg-[#ffda7b]">Исследовать свой сценарий →</a>
       <a href="#library" className="rounded-xl border border-[#98784b] px-6 py-3 text-sm text-[#f0c453]">Библиотека повторений</a>
     </div>
    </div>
    <div className="relative overflow-hidden rounded-3xl border border-[#a0804c]/70 bg-gradient-to-br from-[#392a19] to-[#201b15] p-7 sm:p-9">
      <span className="material-symbols-outlined text-[80px] leading-none text-[#f0c453]" aria-hidden="true">all_inclusive</span>
      <p className={kicker+" mt-5"}>Важен не ярлык, а действие</p>
      <h2 className="mt-3 font-serif text-3xl">Заметил повторение — уже появился промежуток для выбора</h2>
      <div className="mt-6 grid grid-cols-2 gap-3">
       {[[18,'жизненных сценариев'],[6,'сфер жизни'],[1,'эксперимент каждый день'],['0','обязательных анкет']].map(([value,label])=><div key={label} className="rounded-xl border border-[#775e3a]/70 bg-[#17140f] p-4"><p className="font-serif text-3xl text-[#f0c453]">{value}</p><p className="mt-1 text-xs leading-6 text-[#c4b49d]">{label}</p></div>)}
      </div>
    </div>
   </section>
   <section id="map" className="mt-20 scroll-mt-6">
     <p className={kicker}>Твой реальный опыт</p>
     <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Карта <span className="italic text-[#f0c453]">повторения</span></h2>
     <p className="mt-4 max-w-3xl leading-7 text-[#c4b9a6]">Выбери знакомую реакцию и посмотри на её последствия. Мы не будем объявлять, «какой ты человек» — разберём только один возможный сценарий.</p>
     <div className="mt-7 overflow-hidden rounded-3xl border border-[#a17e44]/70 bg-[#211d15]">
       <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#8a683c]/60 bg-[#332719] p-5 sm:p-7"><h3 className="font-serif text-2xl">Ситуация · Реакция · Выбор</h3><p className="text-xs uppercase tracking-wider text-[#e5bc62]">Шаг {step+1} из 3</p></div>
       <div className="p-5 sm:p-8">
        {step===0 && <>
          <h4 className="font-serif text-2xl">Что из этого тебе знакомо?</h4>
          <p className="mt-2 text-sm text-[#ad9e88]">Выбери предварительный образ — он не обязан описывать тебя полностью.</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {patterns.map(p=><button type="button" key={p.slug} aria-pressed={chosen===p.slug} onClick={()=>{setChosen(p.slug);setOutcome('');setStep(1);}}
              className={'rounded-xl border p-4 text-left text-sm leading-6 transition hover:border-[#f0c453] '+(chosen===p.slug?'border-[#f0c453] bg-[#41311d]':'border-[#77613c] bg-[#17140f]')}>
              <span className="block font-serif text-lg">{p.title}</span>
              <span className="mt-2 block text-xs leading-5 text-[#af9f85]">{p.pattern}</span>
            </button>)}
          </div>
        </>}
        {step===1&&picked&&<>
          <p className={kicker}>Повторяющаяся реакция</p>
          <h4 className="mt-3 font-serif text-3xl">{picked.title}</h4>
          <p className="mt-4 text-lg leading-8 text-[#e4d7c3]">{picked.scene}</p>
          <div className="mt-5 rounded-xl border border-[#866a41] bg-[#17140f] p-5"><p className={kicker}>Знакомый внутренний голос</p><p className="mt-2 leading-7">{picked.automatic}</p></div>
          <h5 className="mt-7 font-serif text-xl">Как чаще всего заканчивается похожая ситуация?</h5>
          <p className="mt-2 text-sm leading-6 text-[#ad9e88]">Это не тест и не факт о тебе: выбери то, что ближе, или вернись к другому сценарию.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">{outcomes.map(o=><button key={o.slug} type="button" aria-pressed={outcome===o.slug} onClick={()=>setOutcome(o.slug)} className={'rounded-xl border p-4 text-left text-sm transition hover:border-[#f0c453] '+(outcome===o.slug?'border-[#f0c453] bg-[#40301b]':'border-[#77613c] bg-[#17140f]')}>{o.title}</button>)}</div>
          <div className="mt-7 flex flex-wrap justify-between gap-3"><button type="button" onClick={()=>setStep(0)} className="rounded-xl border border-[#9b7845] px-5 py-3 text-sm text-[#e5bc62]">← Другой сценарий</button><button type="button" disabled={!outcome} onClick={()=>setStep(2)} className="rounded-xl bg-[#f0c453] px-6 py-3 font-semibold text-[#21180b] disabled:opacity-40">Посмотреть разбор →</button></div>
        </>}
        {step===2&&picked&&result&&<>
          <p className={kicker}>Карта одного возможного повторения</p>
          <h4 className="mt-3 font-serif text-3xl">{picked.title}</h4>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[["01 · Ситуация",picked.scene],["02 · Привычный ответ",picked.automatic],["03 · Возможный итог",result.summary],["04 · Мягкий эксперимент",picked.experiment]].map(([title,body])=><div key={title} className="rounded-xl border border-[#78603a]/70 bg-[#17140f] p-5"><p className={kicker}>{title}</p><p className="mt-3 text-sm leading-7 text-[#e2d4c0]">{body}</p></div>)}
          </div>
          <p className="mt-6 text-sm leading-7 text-[#b6a88f]">Каждый шаг здесь — гипотеза, а не вывод. В реальных отношениях и обстоятельствах реакция может быть полностью оправданной.</p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">{picked.questions.map((q,i)=><div key={i} className="rounded-xl border border-[#806638]/70 p-4"><p className="text-xs text-[#e5bc62]">Вопрос {i+1}</p><p className="mt-2 text-sm leading-7">{q}</p></div>)}</div>
          <div className="mt-7 flex flex-wrap gap-3"><button type="button" onClick={()=>setStep(1)} className="rounded-xl border border-[#9b7845] px-5 py-3 text-sm text-[#f0c453]">← Назад</button><button type="button" onClick={reset} className="rounded-xl border border-[#9b7845] px-5 py-3 text-sm text-[#f0c453]">Начать заново</button><Link href={'/explore/patterns/'+picked.slug} className="rounded-xl bg-[#f0c453] px-5 py-3 text-sm font-semibold text-[#21180b]">Изучить подробнее →</Link></div>
        </>}
       </div>
     </div>
   </section>
   <section id="library" className="mt-20 scroll-mt-6">
     <p className={kicker}>Энциклопедия реакций</p>
     <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Библиотека <span className="italic text-[#f0c453]">сценариев</span></h2>
     <p className="mt-4 max-w-3xl leading-7 text-[#c4b9a6]">Здесь собраны 18 распространённых сюжетов, в которых полезно исследовать собственные реакции. Не все сценарии обязаны относиться к тебе.</p>
     <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-wrap gap-2" aria-label="Сферы жизни">{[{id:'all',title:'Все сферы'},...categories].map(cat=><button type="button" key={cat.id} onClick={()=>{setCategory(cat.id);setExpanded(false);}} aria-pressed={category===cat.id} className={'rounded-full border px-3 py-2 text-sm transition hover:border-[#f0c453] '+(category===cat.id?'border-[#f0c453] bg-[#40301b]':'border-[#806638]/70')}>{cat.title}</button>)}</div>
      <label className="text-sm text-[#c5b49a]">Поиск сценария<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Например: контроль" className="mt-2 block w-full rounded-xl border border-[#806638] bg-[#211d15] px-4 py-3 text-sm text-white outline-none placeholder:text-[#988971] focus:border-[#f0c453]"/></label>
     </div>
     <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
       {listed.map(p=><article key={p.slug} className="group rounded-2xl border border-[#806638]/70 bg-[#211d15] p-5 transition hover:border-[#f0c453]">
        <p className={kicker}>{categories.find(c=>c.id===p.category)?.title}</p>
        <h3 className="mt-3 font-serif text-2xl">{p.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#c0b19b]">{p.pattern}</p>
        <Link href={'/explore/patterns/'+p.slug} className="mt-5 inline-block text-sm text-[#f0c453] underline underline-offset-4">Открыть сценарий →</Link>
       </article>)}
     </div>
     {filtered.length===0&&<p className="mt-5 text-sm text-[#b6a88f]">Такого сценария пока нет. Попробуй другое слово.</p>}
     {!expanded&&category==='all'&&!query.trim()&&filtered.length>9&&<button type="button" onClick={()=>setExpanded(true)} className="mt-6 rounded-xl border border-[#9c7d49] px-5 py-3 text-sm text-[#f0c453]">Показать все 18 сценариев ↓</button>}
   </section>
   <section id="daily" className="mt-20 scroll-mt-6">
      <p className={kicker}>Один маленький эксперимент</p>
      <div className="mt-4 rounded-3xl border border-[#ac8a4a]/70 bg-gradient-to-br from-[#352719] to-[#201b14] p-6 sm:p-9">
       <h2 className="font-serif text-3xl sm:text-4xl">Эксперимент <span className="italic text-[#f0c453]">дня</span></h2>
       <p className="mt-5 font-serif text-2xl">{daily.title}</p>
       <p className="mt-3 max-w-3xl text-lg leading-8 text-[#d9cbb6]">{daily.experiment}</p>
       <p className="mt-4 text-sm leading-7 text-[#e5bc62]">{daily.questions[0]}</p>
       <Link href={'/explore/patterns/'+daily.slug} className="mt-6 inline-block rounded-xl bg-[#f0c453] px-5 py-3 text-sm font-semibold text-[#21180b]">Исследовать подробнее →</Link>
       <p className="mt-4 text-xs leading-6 text-[#b4a58e]">Сюжет меняется каждый день и не зависит от персональных данных. Попробуй, только если тема действительно актуальна.</p>
      </div>
   </section>
   <section id="understand" className="mt-20 scroll-mt-6">
      <p className={kicker}>Четыре вопроса к повторению</p>
      <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Как заметить <span className="italic text-[#f0c453]">свой сценарий</span></h2>
      <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
       {[["01","Что происходит?","Назови событие без интерпретации чужих мыслей."],["02","Как я отвечаю?","Заметь привычную мысль, ощущение и действие."],["03","Что меняется?","Посмотри на реальные последствия, не делая глобального вывода."],["04","Как иначе?","Предложи один небольшой безопасный вариант в следующий раз."]].map(([n,title,desc])=><div key={n} className={panel}><p className="font-serif text-3xl text-[#f0c453]">{n}</p><h3 className="mt-4 font-serif text-xl">{title}</h3><p className="mt-3 text-sm leading-7 text-[#c4b9a6]">{desc}</p></div>)}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
       <div className={panel}><h3 className="font-serif text-2xl">Повторение не означает вину</h3><p className="mt-4 text-sm leading-7 text-[#c4b9a6]">Иногда похожие неприятные события возникают из-за обстоятельств или чужого поведения. Не стоит искать «собственный сценарий» там, где ответственность лежит на другом человеке.</p></div>
       <div className={panel}><h3 className="font-serif text-2xl">При небезопасных отношениях</h3><p className="mt-4 text-sm leading-7 text-[#c4b9a6]">Если ситуация связана с угрозами, насилием или принуждением, приоритет — безопасность и поддержка, а не анализ своей роли. Ты не обязан исправлять чужое поведение.</p></div>
      </div>
   </section>
   <footer className="mt-16 border-t border-[#84683e]/50 pt-10 text-center">
    <p className="font-serif text-2xl">Повторение — не приговор. Замеченное становится выбором.</p>
    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#bbaa93]">{data.intro} Индивидуальные ответы не сохраняются.</p>
    <Link href="/editoria" className="mt-6 inline-block rounded-xl bg-[#f0c453] px-6 py-3 text-sm font-semibold text-[#21180b]">Бесплатный практикум →</Link>
   </footer>
  </main>
 </div>;
}
