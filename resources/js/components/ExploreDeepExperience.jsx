import React, { useState } from 'react';
import { RelationshipDepth, BodyDepth, ChoiceDepth } from './ExploreThreeDepth.jsx';
import { BeliefsDepth, ValuesDepth, FearsDepth, TimeDepth, ConflictsDepth, AttentionDepth } from './ExploreSixDepth.jsx';

const panel = 'rounded-3xl border border-[#957444]/65 bg-[#211c15] p-5 sm:p-8';
const small = 'rounded-2xl border border-[#80653e]/65 bg-[#19160f] p-4 sm:p-5';
const gold = 'text-[#f0c453]';
const btn = 'rounded-xl border border-[#967749] bg-[#231c14] px-4 py-3 text-left text-sm leading-6 text-[#eddec8] transition hover:border-[#f0c453] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453]';
const active = 'border-[#f0c453] bg-[#41301c] text-[#fff0d4]';
function Caption({ children }) { return <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#e6c276]">{children}</p>; }
function Intro({ count, title, subtitle }) { return <div><Caption>Интерактивное исследование {count}</Caption><h3 className="mt-3 font-serif text-3xl sm:text-4xl">{title}</h3><p className="mt-3 max-w-3xl leading-7 text-[#cbbba3]">{subtitle}</p></div>; }
function Chip({ label, onClick, picked }) { return <button type="button" aria-pressed={picked} onClick={onClick} className={btn + ' ' + (picked ? active : '')}>{label}</button>; }
function Result({ title, children }) { return <div aria-live="polite" className="mt-6 rounded-2xl border border-[#e1bb72]/55 bg-[#38291b] p-5 sm:p-7"><Caption>Что можно заметить</Caption><h4 className="mt-3 font-serif text-2xl text-[#fff0d5]">{title}</h4><div className="mt-3 space-y-3 leading-7 text-[#e0cfb5]">{children}</div></div>; }
function PillTabs({ items, value, setValue }) { return <div className="mt-6 flex flex-wrap gap-2">{items.map((item,i)=><Chip key={i} label={item} picked={value===i} onClick={()=>setValue(i)}/>)}</div>; }

function RelationshipLab() {
 const [moment,setMoment]=useState(0),[response,setResponse]=useState(null);
 const situations=[
  {title:'Тебя не слышат',line:'Ты пытаешься объяснить важное, собеседник перебивает.',phrases:['«Ты никогда меня не слушаешь!»','Замолчать и отдалиться','«Мне важно закончить мысль. Можно я договорю?»'],read:['Обвинение через «никогда» переносит разговор с одного поступка на личность. Собеседник может начать защищаться вместо слушания.','Пауза снизит напряжение, но человек не узнает, что именно было важно. Молчание не заменяет договорённость.','Конкретная просьба про текущий разговор оставляет шанс услышать друг друга. Она не гарантирует согласия.'],question:'Как назвать конкретный эпизод без оценки всей личности?'},
  {title:'Тебе отказали',line:'Близкий не может выполнить твою просьбу.',phrases:['«Значит, тебе на меня плевать»','«Ничего не надо, справлюсь сам»','«Мне жаль. Есть ли другое время или вариант?»'],read:['Отказ на одну просьбу превращается в вывод о чувствах другого — это пока предположение.','Отстранение может скрывать обиду, но не делает потребность понятнее.','Уточнение допускает реальные ограничения другого и помогает найти альтернативу.'],question:'Что означает сам отказ — и что я к нему додумал?'},
  {title:'Нарушают договорённость',line:'Человек в третий раз опаздывает, хотя вы обсуждали время.',phrases:['«Ты всегда всё портишь»','Ничего не сказать и ждать в следующий раз','«Я жду 15 минут. После этого ухожу. Давай договоримся заранее»'],read:['Обобщение уводит от повторяющегося конкретного действия и его последствий.','Молчание сохраняет неопределённость: человек не знает твоего правила.','Граница описывает твои действия и делает последствия понятными, без угроз и унижения.'],question:'Какая договорённость зависит именно от твоих действий?'}
 ];
 const s=situations[moment];
 return <section className={panel}><Intro count="01" title="Мастерская диалога" subtitle="Попробуй три разных способа ответить в одной ситуации. Каждый приводит к другой динамике разговора — без оценки «хороший» или «плохой человек»."/>
 <PillTabs items={situations.map(x=>x.title)} value={moment} setValue={i=>{setMoment(i);setResponse(null);}}/>
 <div className={small+' mt-6'}><Caption>Сцена</Caption><p className="mt-3 text-lg leading-8">{s.line}</p></div>
 <div className="mt-5 grid gap-3 md:grid-cols-3">{s.phrases.map((x,i)=><Chip key={i} label={x} picked={response===i} onClick={()=>setResponse(i)}/>)}</div>
 {response!==null&&<Result title={['Обвинение','Молчание','Прямая просьба'][response]}><p>{s.read[response]}</p><p className={gold}>{s.question}</p></Result>}
 </section>;
}

function RelationshipCombined(){return <><RelationshipLab/><div className="mt-8"><RelationshipDepth/></div></>;}

export default function ExploreDeepExperience({slug}){
 const C={relationships:RelationshipCombined,body:BodyDepth,choice:ChoiceDepth,beliefs:BeliefsDepth,values:ValuesDepth,fears:FearsDepth,time:TimeDepth,conflicts:ConflictsDepth,attention:AttentionDepth}[slug];
 return C?<C/>:null;
}
