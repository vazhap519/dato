import React, { useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import data from '../../data/personality-mirror.json';

const axes=data.axes;
const questions=data.questions;
const kicker='text-xs font-semibold uppercase tracking-[.18em] text-[#f0c453]';
const panel='rounded-2xl border border-[#84683f]/70 bg-[#211d15] p-5 sm:p-7';
const scoreMap=axis=>questions.filter(q=>q.axis===axis.slug);
const calculateScores=answers=>axes.map(axis=>{
 const selected=scoreMap(axis);
 const total=selected.reduce((sum,q)=>sum+(q.reverse?3-answers[q.id]:answers[q.id]),0);
 const value=Math.round(total/(selected.length*3)*100);
 const message=value<40?axis.leftText:value>60?axis.rightText:axis.middleText;
 return {...axis,value,message};
});

export default function ExplorePersonalityMirror(){
 const {settings={}}=usePage().props;
 const [answers,setAnswers]=useState({});
 const [section,setSection]=useState(0);
 const [showResults,setShowResults]=useState(false);
 const [selectedDilemma,setSelectedDilemma]=useState(null);
 const [dilemmaChoice,setDilemmaChoice]=useState(null);
 const daily=data.prompts[Math.floor(Date.now()/86400000)%data.prompts.length];
 const currentAxis=axes[section];
 const currentQuestions=questions.filter(q=>q.axis===currentAxis.slug);
 const answered=Object.keys(answers).length;
 const allAnswered=answered===questions.length;
 const currentComplete=currentQuestions.every(q=>Number.isInteger(answers[q.id]));
 const scores=useMemo(()=>allAnswered?calculateScores(answers):[],[answers,allAnswered]);
 const next=()=>{
   if(!currentComplete)return;
   if(section===axes.length-1) setShowResults(true);
   else setSection(n=>n+1);
 };
 const reset=()=>{setAnswers({});setSection(0);setShowResults(false);};
 return <div data-no-analytics className="min-h-screen bg-[#14120d] text-[#f8f4e9]">
  <Head title="Зеркало личности — наблюдай свои способы выбора — Arutyun">
   <meta name="description" content="24 вопроса о привычных реакциях, шесть осей наблюдения, вопрос дня и 12 жизненных дилемм. Без диагнозов, типов личности и хранения ответов."/>
  </Head>
  <header className="border-b border-[#b99347]/25"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
   <Link href="/" aria-label="На главную">{settings?.logo?<img src={settings.logo} alt="Arutyun" className="h-10 max-w-[160px] object-contain"/>:<span className="font-serif text-2xl italic text-[#f0c453]">Arutyun</span>}</Link>
   <nav aria-label="Навигация по странице" className="flex flex-wrap gap-4 text-sm">
    <a href="#mirror" className="text-[#e4c88c] hover:text-white">Моя карта</a>
    <a href="#dimensions" className="text-[#e4c88c] hover:text-white">Шесть граней</a>
    <a href="#question" className="text-[#e4c88c] hover:text-white">Вопрос дня</a>
    <a href="#dilemmas" className="text-[#e4c88c] hover:text-white">Дилеммы</a>
    <Link href="/explore" className="text-[#b9a98e] hover:text-white">Все направления →</Link>
   </nav>
  </div></header>
  <main className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:pt-16">
   <section className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
    <div>
     <p className={kicker}>Пространство самопознания</p>
     <h1 className="mt-4 font-serif text-5xl sm:text-6xl">Зеркало <span className="italic text-[#f0c453]">личности</span></h1>
     <p className="mt-6 max-w-3xl text-lg leading-8 text-[#ddd0bd]">Каким способом ты выбираешь, устанавливаешь границы, просишь поддержки, встречаешь перемены? Внутри каждого из нас больше оттенков, чем позволяет один ярлык.</p>
     <p className="mt-4 max-w-3xl leading-7 text-[#b7a891]">Это не попытка определить «настоящего тебя». Это зеркало твоих сегодняшних ответов — повод заметить привычные ориентиры и открыть пространство для выбора.</p>
     <div className="mt-7 flex flex-wrap gap-3">
      <a href="#mirror" className="rounded-xl bg-[#f0c453] px-6 py-3 font-semibold text-[#21180b] hover:bg-[#ffda7b]">Пройти зеркало · 24 вопроса →</a>
      <a href="#question" className="rounded-xl border border-[#9b7845] px-6 py-3 text-sm text-[#f0c453]">Начать с одного вопроса</a>
     </div>
    </div>
    <div className="relative overflow-hidden rounded-3xl border border-[#997847]/70 bg-gradient-to-br from-[#342718] to-[#211b14] p-7 sm:p-9">
      <span className="material-symbols-outlined text-[76px] leading-none text-[#f0c453]" aria-hidden="true">self_improvement</span>
      <p className={kicker+" mt-5"}>Не тест на правильность</p>
      <h2 className="mt-3 font-serif text-3xl">Не узнать, кем ты обязан быть. Увидеть, как выбираешь.</h2>
      <div className="mt-7 grid grid-cols-2 gap-3">{[[24,'вопроса'],[6,'граней опыта'],[12,'жизненных дилемм'],[30,'вопросов дня']].map(([value,title])=><div key={title} className="rounded-xl border border-[#755d38]/70 bg-[#17140f] p-4"><p className="font-serif text-3xl text-[#f0c453]">{value}</p><p className="mt-1 text-xs leading-5 text-[#c0b19c]">{title}</p></div>)}</div>
      <p className="mt-5 text-xs leading-6 text-[#ae9e86]">Без регистрации, личного журнала и сохранения выбранных ответов.</p>
    </div>
   </section>
   <section id="mirror" className="mt-20 scroll-mt-6">
    <p className={kicker}>Зеркало реакций</p>
    <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Шесть граней <span className="italic text-[#f0c453]">выбора</span></h2>
    <p className="mt-4 max-w-3xl leading-7 text-[#c4b9a6]">24 утверждения, по четыре на каждую тему. Выбирай, насколько часто ты узнаёшь себя в описании. Нет хороших и плохих ответов, а итог не является научным психологическим тестом.</p>
    <div className="mt-7 overflow-hidden rounded-3xl border border-[#a0804a]/70 bg-[#211d15]">
      {!showResults ? <>
       <div className="border-b border-[#81653f]/60 bg-[#332718] p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3"><p className={kicker}>Грань {section+1} из {axes.length}</p><p className="text-sm text-[#e5bc62]">{answered} / {questions.length} ответов</p></div>
        <h3 className="mt-3 font-serif text-3xl">{currentAxis.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#c5b39c]">{currentAxis.description}</p>
        <div className="mt-6 grid grid-cols-6 gap-2">{axes.map((a,i)=><div key={a.slug} className={'h-1.5 rounded-full '+(i<=section?'bg-[#f0c453]':'bg-[#6d5434]')} />)}</div>
       </div>
       <div className="grid gap-4 p-4 sm:p-8">
        {currentQuestions.map((q,i)=><fieldset key={q.id} className="rounded-2xl border border-[#765f3b]/70 bg-[#18150f] p-4 sm:p-6">
          <legend className="sr-only">{q.statement}</legend>
          <p className="font-serif text-lg leading-7">{i+1}. {q.statement}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
           {data.scale.map((label,index)=><button key={label} type="button" aria-pressed={answers[q.id]===index}
             onClick={()=>setAnswers(p=>({...p,[q.id]:index}))}
             className={'rounded-xl border px-3 py-3 text-sm leading-5 transition hover:border-[#f0c453] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] '+(answers[q.id]===index?'border-[#f0c453] bg-[#47351c] text-[#fff6df]':'border-[#7a623f]/80 text-[#c6b7a1]')}>{label}</button>)}
          </div>
         </fieldset>)}
       </div>
       <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#806638]/60 p-5 sm:p-8">
        <button type="button" disabled={section===0} onClick={()=>setSection(n=>Math.max(0,n-1))} className="rounded-xl border border-[#957749] px-5 py-3 text-sm text-[#e5bc62] disabled:cursor-not-allowed disabled:opacity-30">← Назад</button>
        <button type="button" disabled={!currentComplete} onClick={next} className="rounded-xl bg-[#f0c453] px-6 py-3 font-semibold text-[#21180b] disabled:cursor-not-allowed disabled:opacity-35">{section===5?'Посмотреть мою карту →':'Следующая грань →'}</button>
       </div>
      </> : <>
        <div className="border-b border-[#806638]/60 bg-[#342718] p-6 sm:p-9">
          <p className={kicker}>Твоя карта сегодняшних ответов</p>
          <h3 className="mt-3 font-serif text-3xl sm:text-4xl">Как проявились разные способы выбора?</h3>
          <p className="mt-4 text-sm leading-7 text-[#c8b9a0]">Значения показаны для этих 24 ответов, не измеряют черты личности и не подтверждают никакой диагноз. Левый и правый полюса равно допустимы — это разные подходы.</p>
        </div>
        <div className="grid gap-5 p-5 sm:p-9">
         {scores.map(axis=><article key={axis.slug} className="rounded-2xl border border-[#84683f]/70 bg-[#17140f] p-5 sm:p-7">
           <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-serif text-2xl">{axis.title}</h4><span className="text-xs text-[#d8b66c]">По ответам этой анкеты</span></div>
           <div className="mt-5 flex justify-between gap-4 text-xs leading-5 text-[#c9b99f]"><span>{axis.left}</span><span className="text-right">{axis.right}</span></div>
           <div className="relative mt-3 h-3 rounded-full bg-[#3c3021]">
             <span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#806636] to-[#e9bd63]" style={{width:axis.value+'%'}} />
             <span className="absolute top-1/2 h-5 w-2 -translate-x-1/2 -translate-y-1/2 rounded bg-[#fff0ce]" style={{left:axis.value+'%'}}/>
           </div>
           <p className="mt-5 text-sm leading-7 text-[#d7c9b5]">{axis.message}</p>
           <div className="mt-4 border-t border-[#725b39] pt-4"><p className={kicker}>Небольшой эксперимент</p><p className="mt-2 text-sm leading-7 text-[#d0bfa5]">{axis.practice}</p></div>
         </article>)}
        </div>
        <div className="flex flex-wrap gap-3 border-t border-[#806638]/60 p-5 sm:p-8">
          <button type="button" onClick={()=>{setShowResults(false);setSection(0);}} className="rounded-xl border border-[#957749] px-5 py-3 text-sm text-[#f0c453]">Пересмотреть ответы</button>
          <button type="button" onClick={reset} className="rounded-xl bg-[#f0c453] px-6 py-3 font-semibold text-[#21180b]">Пройти заново</button>
        </div>
        <p className="px-5 pb-7 text-xs leading-6 text-[#a99d88] sm:px-9">При переходе со страницы ответы исчезнут. Сервер не получает выбранные варианты и не хранит персональную карту.</p>
      </>}
    </div>
   </section>

   <section id="dimensions" className="mt-20 scroll-mt-6">
    <p className={kicker}>Шесть направлений внимания</p>
    <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Из чего состоит <span className="italic text-[#f0c453]">карта?</span></h2>
    <p className="mt-4 max-w-3xl leading-7 text-[#c4b9a6]">Каждая грань — спектр возможных способов действий, а не категория человека. В разных обстоятельствах твои ответы могут меняться.</p>
    <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {axes.map((axis,i)=><article key={axis.slug} className={panel}>
       <p className="font-serif text-3xl text-[#f0c453]">{String(i+1).padStart(2,'0')}</p>
       <h3 className="mt-4 font-serif text-2xl">{axis.title}</h3>
       <p className="mt-3 text-sm leading-7 text-[#c4b9a6]">{axis.description}</p>
       <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full border border-[#7c633f] px-3 py-2 text-xs text-[#cbb995]">{axis.left}</span><span className="rounded-full border border-[#7c633f] px-3 py-2 text-xs text-[#cbb995]">{axis.right}</span></div>
      </article>)}
    </div>
   </section>

   <section id="question" className="mt-20 scroll-mt-6">
     <p className={kicker}>Один вопрос без теста</p>
     <div className="mt-4 rounded-3xl border border-[#a8864b]/70 bg-gradient-to-br from-[#362818] to-[#211c14] p-6 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4"><p className={kicker}>Вопрос дня · {daily.topic}</p><span aria-hidden="true" className="material-symbols-outlined text-4xl text-[#f0c453]">lightbulb</span></div>
      <h2 className="mt-5 max-w-4xl font-serif text-3xl leading-tight sm:text-4xl">{daily.question}</h2>
      <p className="mt-5 max-w-2xl text-sm leading-7 text-[#c4b9a6]">Попробуй не отвечать автоматически. Заметь первое объяснение, затем проверь его на конкретном примере из жизни.</p>
      <p className="mt-4 text-xs leading-6 text-[#a99d88]">Вопрос выбирается по календарному дню. Он не является персональным прогнозом.</p>
     </div>
   </section>

   <section id="dilemmas" className="mt-20 scroll-mt-6">
     <p className={kicker}>Разные решения — разные основания</p>
     <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Жизненные <span className="italic text-[#f0c453]">дилеммы</span></h2>
     <p className="mt-4 max-w-3xl leading-7 text-[#c4b9a6]">В этих ситуациях нет правильного ответа. Выбери возможную реакцию, а затем посмотри на вопрос, который стоит за выбором.</p>
     <div className="mt-7 grid gap-3 md:grid-cols-2">
      {data.dilemmas.map(d=>{
        const isOpen=selectedDilemma===d.id;
        return <article key={d.id} className={'self-start overflow-hidden rounded-2xl border '+(isOpen?'border-[#c39a50] bg-[#2a2117]':'border-[#806638]/70 bg-[#211d15]')}>
         <button type="button" aria-expanded={isOpen} aria-controls={'dilemma-'+d.id} onClick={()=>{setSelectedDilemma(isOpen?null:d.id);setDilemmaChoice(null);}} className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-[#302719]">
           <span className="font-serif text-xl">{d.title}</span><span className={'material-symbols-outlined shrink-0 text-[#f0c453] transition-transform '+(isOpen?'rotate-180':'')}>keyboard_arrow_down</span>
         </button>
         {isOpen&&<div id={'dilemma-'+d.id} className="border-t border-[#84683f]/70 p-5">
          <p className="text-sm leading-7 text-[#d5c7b3]">{d.scene}</p>
          <div className="mt-4 grid gap-2">{d.options.map((o,i)=><button key={i} type="button" aria-pressed={dilemmaChoice===i} onClick={()=>setDilemmaChoice(i)} className={'rounded-xl border p-4 text-left text-sm leading-6 transition hover:border-[#f0c453] '+(dilemmaChoice===i?'border-[#f0c453] bg-[#44331c]':'border-[#806638]/70 bg-[#17140f]')}>{o}</button>)}</div>
          {dilemmaChoice!==null&&<div aria-live="polite" className="mt-5 rounded-xl border border-[#9a7844]/70 bg-[#17140f] p-4"><p className={kicker}>Вопрос к выбору</p><p className="mt-3 text-sm leading-7">{d.question}</p><p className="mt-3 text-xs leading-6 text-[#ab9d88]">Это повод исследовать мотив, а не оценка выбранного варианта.</p></div>}
         </div>}
        </article>;
      })}
     </div>
   </section>
   <section className="mt-16 grid gap-4 md:grid-cols-2">
     <div className={panel}><h3 className="font-serif text-2xl">Почему здесь нет типов личности?</h3><p className="mt-4 text-sm leading-7 text-[#c4b9a6]">Разные роли и привычки проявляются в зависимости от ситуации, опыта и отношений. Двадцать четыре самооценки не позволяют уверенно судить о личности в целом.</p></div>
     <div className={panel}><h3 className="font-serif text-2xl">Что делать с результатом?</h3><p className="mt-4 text-sm leading-7 text-[#c4b9a6]">Не искать правильный полюс. Лучше выбрать одно наблюдение, сверить его с реальной жизнью и попробовать небольшое действие, когда обстоятельства позволяют.</p></div>
   </section>
   <footer className="mt-16 border-t border-[#84683e]/50 pt-10 text-center">
    <p className="font-serif text-2xl">Ты больше любой карты, которую можно нарисовать.</p>
    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#b8aa92]">{data.intro} Результаты не сохраняются.</p>
    <Link href="/editoria" className="mt-6 inline-block rounded-xl bg-[#f0c453] px-6 py-3 text-sm font-semibold text-[#21180b]">Бесплатный практикум →</Link>
   </footer>
  </main>
 </div>;
}
