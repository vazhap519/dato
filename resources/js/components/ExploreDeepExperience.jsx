import React, { useState } from 'react';
import { RelationshipDepth, BodyDepth, ChoiceDepth } from './ExploreThreeDepth.jsx';

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
 const [moment,setMoment]=useState(0),[response,setResponse]=useState(null),[method,setMethod]=useState(0);
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
 <div className="mt-9"><Caption>Второй инструмент — что именно я хочу сказать?</Caption><p className="mt-3 leading-7 text-[#c9baa3]">Выбери цель разговора. Формулировка меняется в зависимости от задачи.</p>
 <PillTabs items={['Быть услышанным','Обозначить границу','Попросить поддержку']} value={method} setValue={setMethod}/>
 <Result title={['Прояснить услышанное','Показать предел','Сделать просьбу конкретной'][method]}><p>{['«Мне важно, чтобы ты услышал мою мысль до конца. Как ты понял то, что я сказал?»','«Когда разговор переходит на оскорбления, я его прекращаю. Вернусь, когда мы сможем говорить спокойно».','«Мне нужна поддержка сегодня. Можешь послушать меня десять минут, не предлагая решения?»'][method]}</p><p>Попробуй заметить: эта фраза сообщает о твоём опыте или требует от другого угадать твои чувства?</p></Result></div></section>;
}

function BodyLab() {
 const parts=['Голова','Челюсть','Грудная клетка','Плечи и шея','Живот','Спина','Руки','Ноги'];
 const [part,setPart]=useState(null),[quality,setQuality]=useState(0),[trend,setTrend]=useState(0);
 return <section className={panel}><Intro count="01" title="Атлас ощущений" subtitle="Исследуй не «что это значит», а где, как и когда возникает ощущение. Само по себе оно не позволяет определить медицинскую или психологическую причину."/>
 <div className="mt-7 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
 <div className={small+' relative flex min-h-[350px] items-center justify-center'}><svg viewBox="0 0 180 300" className="h-[300px] max-w-full" aria-hidden="true"><circle cx="90" cy="37" r="29" fill="#6e5637" stroke="#e2b969" strokeWidth="2"/><path d="M68 68 Q48 78 42 108 L20 177 39 185 62 124 64 205 58 284 82 284 90 216 98 284 122 284 116 205 118 124 141 185 160 177 138 108 Q132 78 112 68 Z" fill="#483829" stroke="#d6aa61" strokeWidth="2"/><path d="M90 68v143" stroke="#caa56c" strokeDasharray="4 6" opacity=".6"/></svg><span className="absolute bottom-4 left-4 text-xs text-[#c8b496]">Схема для ориентира, не диагностика</span></div>
 <div><Caption>1. Где заметнее?</Caption><div className="mt-3 grid grid-cols-2 gap-2">{parts.map((x,i)=><Chip key={i} label={x} picked={part===i} onClick={()=>setPart(i)}/>)}</div><Caption>2. Как ощущается?</Caption><PillTabs items={['Напряжение','Тепло / покой','Дискомфорт','Усталость']} value={quality} setValue={setQuality}/><Caption>3. Как меняется?</Caption><PillTabs items={['Только заметил','Усиливается','Слабеет','Повторяется']} value={trend} setValue={setTrend}/></div></div>
 {part!==null&&<Result title={parts[part]+' · '+['напряжение','тепло или покой','дискомфорт','усталость'][quality]}><p>Ты отметил: <strong>{parts[part].toLowerCase()}</strong>; динамика: {['ощущение замечено недавно','ощущение усиливается','ощущение ослабевает','ощущение повторяется'][trend]}.</p><p>{quality===1?'Приятное состояние тоже можно просто заметить, не пытаясь удержать навсегда.':'Обрати внимание на время появления, нагрузку, сон, движение и сопутствующие симптомы. По этим данным нельзя поставить диагноз.'}</p><p className={gold}>{trend===1?'Если симптом новый, необычный или нарастает, важно обратиться за медицинской оценкой.':'Можно проверить, изменится ли ощущение после комфортной паузы, без болезненных движений.'}</p></Result>}
 <p className="mt-6 text-sm leading-7 text-[#d4b47c]">Сильная или внезапная боль, боль в груди, одышка и внезапная слабость требуют своевременной медицинской помощи. Самонаблюдение не заменяет обследование.</p></section>;
}

function ChoiceLab(){
 const [priority,setPriority]=useState(0),[risk,setRisk]=useState(0),[reversible,setReversible]=useState(0);
 const criteria=['Сохранить устойчивость','Получить опыт и развитие','Сберечь отношения','Сохранить свободу'];
 const scenarios=[['Проверять маленьким шагом','Подготовить переход','Оценить обязательства','Оставить запасной план'],['Провести пробный проект','Узнать реальные требования','Согласовать ожидания','Проверить альтернативу']];
 return <section className={panel}><Intro count="01" title="Лаборатория выбора" subtitle="Вместо ответа за человека — инструмент сравнения. Меняя критерии, риск и обратимость, ты увидишь, почему один совет не подходит всем."/>
 <Caption>Что важнее в этом решении?</Caption><div className="mt-4 grid gap-2 sm:grid-cols-2">{criteria.map((v,i)=><Chip key={i} label={v} picked={priority===i} onClick={()=>setPriority(i)}/>)}</div>
 <div className="mt-7 grid gap-6 md:grid-cols-2"><div><Caption>Цена ошибки</Caption><PillTabs items={['Небольшая','Значительная']} value={risk} setValue={setRisk}/></div><div><Caption>Можно ли отменить?</Caption><PillTabs items={['Да, почти полностью','Трудно или невозможно']} value={reversible} setValue={setReversible}/></div></div>
 <div className="mt-7 grid gap-4 md:grid-cols-2"><div className={small}><Caption>Путь А: действовать сейчас</Caption><p className="mt-3 text-lg">Быстрее получаешь обратную связь, но принимаешь риск ошибки.</p><p className="mt-4 text-sm text-[#e6ca8a]">Проверка: {scenarios[0][priority]}.</p></div><div className={small}><Caption>Путь Б: подготовиться</Caption><p className="mt-3 text-lg">Собираешь сведения и ресурсы, но тратишь время и можешь отложить возможность.</p><p className="mt-4 text-sm text-[#e6ca8a]">Проверка: {scenarios[1][priority]}.</p></div></div>
 <Result title={risk===1||reversible===1?'Сначала уменьшить неопределённость':'Начать с небольшого эксперимента'}><p>{risk===1||reversible===1?'Цена ошибки или необратимость высока. Полезно проверить факты, ресурсы, сроки и последствия прежде чем делать ставку.':'Решение обратимо, а цена ошибки невелика. Пробный шаг может дать больше информации, чем бесконечное обдумывание.'}</p><p className={gold}>Критерий: {criteria[priority]}. Это ориентир для оценки, не автоматическое решение.</p></Result></section>;
}

function BeliefLab(){
 const thoughts=[
 {thought:'Если ошибся — значит, ни на что не способен',fact:'Один поступок или результат',jump:'«Одна ошибка определяет все мои способности»',other:'Я допустил ошибку в конкретном деле. Могу разобраться, что не получилось, не обобщая на всю личность.'},
 {thought:'Если человек молчит — значит, он злится на меня',fact:'Человек пока не ответил',jump:'«Мне известна причина его молчания»',other:'Я не знаю причину. Могу уточнить, если это уместно, вместо чтения мыслей.'},
 {thought:'Мне уже поздно что-либо менять',fact:'Некоторые возможности действительно требуют времени и ресурсов',jump:'«Никакие перемены больше невозможны»',other:'Не всё доступно, но я могу проверить одну реальную возможность сейчас.'},
 {thought:'Меня должны любить абсолютно все',fact:'Люди по-разному относятся друг к другу',jump:'«Несогласие означает, что со мной что-то не так»',other:'Невозможно нравиться всем. Я могу сохранять уважение к себе и другим.'}
 ];
 const [selected,setSelected]=useState(0),[view,setView]=useState(0);const t=thoughts[selected];
 return <section className={panel}><Intro count="01" title="Рентген убеждения" subtitle="Разложи жёсткое утверждение на наблюдение, скрытый вывод и более точную формулировку. Никакого принудительного «позитивного мышления»."/>
 <div className="mt-6 grid gap-3 md:grid-cols-2">{thoughts.map((v,i)=><Chip key={i} label={'«'+v.thought+'»'} picked={selected===i} onClick={()=>{setSelected(i);setView(0);}}/>)}</div>
 <PillTabs items={['Что известно','Где скачок логики','Как точнее сказать']} value={view} setValue={setView}/>
 <Result title={['Наблюдаемая часть','Непроверенный вывод','Гибкая формулировка'][view]}><p>{[t.fact,t.jump,t.other][view]}</p><p className={gold}>{['Можно ли это проверить без предположений?','Какое исключение нарушит категорическое правило?','Это не утешение, а попытка быть точнее.'][view]}</p></Result>
 <div className={small+' mt-7'}><Caption>Второе упражнение — найди слова-ловушки</Caption><p className="mt-3 text-lg">«Я <span className="text-[#f0c453]">всегда</span> всё порчу, <span className="text-[#f0c453]">никто</span> меня не понимает, и я <span className="text-[#f0c453]">должен</span> всё делать идеально».</p><p className="mt-3 text-sm leading-7 text-[#cbbba3]">Такие слова иногда отражают реальный опыт, но часто делают утверждения абсолютными. Попробуй заменить их конкретными событиями и проверяемыми условиями.</p></div></section>;
}

function ValuesLab(){
 const values=['Свобода','Близость','Честность','Забота','Развитие','Покой','Творчество','Справедливость','Смелость','Здоровье','Любопытство','Ответственность'];
 const [chosen,setChosen]=useState([]),[tested,setTested]=useState(0);const tests=[
 ['Забота','Свобода','Кто-то просит тебя помочь в выходной, который ты хотел провести один.'],
 ['Честность','Близость','Нужно обсудить неудобный вопрос с дорогим человеком.'],
 ['Развитие','Покой','Ты можешь взять дополнительный проект, но давно не отдыхал.']
 ];
 return <section className={panel}><Intro count="01" title="Созвездие ценностей" subtitle="Выбери до четырёх ориентиров, которые действительно важны тебе сейчас. Здесь нет единственно верного набора — и нет оценки характера."/>
 <div className="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">{values.map(x=><Chip key={x} label={(chosen.includes(x)?'✓ ':'○ ')+x} picked={chosen.includes(x)} onClick={()=>setChosen(v=>v.includes(x)?v.filter(k=>k!==x):v.length<4?[...v,x]:v)}/>)}</div>
 {chosen.length>0&&<Result title={'Выбрано: '+chosen.length+' из 4'}><p className={gold}>{chosen.join(' · ')}</p><p>Ценности не складываются в «тип личности». Следующий вопрос: где каждая из них уже проявляется в действиях, а где остаётся только словом?</p></Result>}
 <div className="mt-10"><Caption>Проверь ценности в столкновении</Caption><PillTabs items={['Забота и свобода','Честность и близость','Развитие и покой']} value={tested} setValue={setTested}/>
 <div className={small+' mt-5'}><p className="text-lg leading-8">{tests[tested][2]}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-[#91754c] p-4"><strong className={gold}>{tests[tested][0]}</strong><p className="mt-2 text-sm leading-6">Что стоит за потребностью действовать в сторону этой ценности?</p></div><div className="rounded-xl border border-[#91754c] p-4"><strong className={gold}>{tests[tested][1]}</strong><p className="mt-2 text-sm leading-6">Что ты рискуешь потерять, если проигнорируешь эту сторону?</p></div></div></div>
 <p className="mt-4 leading-7 text-[#cbbba3]">Исследуй третий вариант, который не обнуляет ни одну потребность. Например, заранее договориться о времени и посильной форме участия.</p></div></section>;
}

function FearLab(){
 const [threat,setThreat]=useState(0),[uncertainty,setUncertainty]=useState(0),[safety,setSafety]=useState(0);
 return <section className={panel}><Intro count="01" title="Навигатор страха" subtitle="Здесь мы не оцениваем, насколько ты смелый. Сначала различаем реальные признаки угрозы, недостаток сведений и безопасность возможного действия."/>
 <Caption>Есть ли конкретные признаки опасности?</Caption><PillTabs items={['Пока только предположения','Есть признаки, но многое неизвестно','Угроза явная и непосредственная']} value={threat} setValue={setThreat}/>
 <Caption>Чего не хватает для ясности?</Caption><PillTabs items={['Фактов','Поддержки','Плана действий']} value={uncertainty} setValue={setUncertainty}/>
 <Caption>Можно ли безопасно отступить или обратиться за помощью?</Caption><PillTabs items={['Да','Пока не знаю']} value={safety} setValue={setSafety}/>
 <Result title={threat===2?'Безопасность важнее упражнения':threat===1?'Проверяй риск, не обесценивая сигнал':'Проверяй предположения небольшим шагом'}><p>{threat===2?'Если опасность реальна и непосредственна, не нужно преодолевать страх ради «роста». Выбирай уход из опасной ситуации и обращение за доступной помощью.':threat===1?'Есть причины отнестись к ситуации серьёзно. Прежде чем действовать, уточни обстоятельства, оценку риска и доступные меры защиты.':'Предположение может пугать не меньше факта. Если ситуация безопасна, можно проверить одну неизвестную деталь без большой ставки.'}</p><p className={gold}>{['Полезный следующий шаг — найти надёжную информацию.','Полезный следующий шаг — поговорить с компетентным человеком.','Полезный следующий шаг — составить простой безопасный план.'][uncertainty]}</p>{safety===1&&<p>Если не уверен в безопасности, не заставляй себя экспериментировать.</p>}</Result></section>;
}

function TimeLab(){
 const [focus,setFocus]=useState(1),[situation,setSituation]=useState(0);
 const ages=['Вчера','Сегодня','Завтра'];const samples=[
 ['Я снова вспоминаю ошибку','Какие сведения были мне доступны тогда?','Какой вывод из опыта поможет сегодня?'],
 ['Я спешу и ничего не замечаю','Что требует внимания именно сейчас?','Какое одно дело я могу завершить без гонки?'],
 ['Я тревожусь о будущем','Какую часть риска я могу подготовить?','Что остаётся неизвестным, даже если я всё спланирую?']
 ];
 return <section className={panel}><Intro count="01" title="Три горизонта времени" subtitle="Переключай перспективу: сожаление, присутствие и планирование требуют разных вопросов. Цель не застрять в одном из времён."/>
 <div className="relative mt-10 grid grid-cols-3 gap-3 before:absolute before:left-[16%] before:right-[16%] before:top-8 before:h-px before:bg-[#a88a53]/60">{ages.map((v,i)=><button key={v} type="button" onClick={()=>{setFocus(i);setSituation(i);}} className={'relative rounded-2xl border p-4 text-center transition '+(focus===i?'border-[#f0c453] bg-[#41301d]':'border-[#866a45] bg-[#1b1711]')}><span className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#e2bd73] bg-[#261e13] text-[#f0c453]">{i+1}</span><span className="font-serif text-lg">{v}</span></button>)}</div>
 <Result title={samples[situation][0]}><p>{samples[situation][1]}</p><p className={gold}>{samples[situation][2]}</p></Result>
 <div className="mt-8 grid gap-3 md:grid-cols-3">{['Память даёт урок, но не право переписать прошлое.','Настоящее — не идеальное спокойствие, а реальная возможность действия.','План — направление, а не гарантия исхода.'].map((x,i)=><div key={i} className={small}><Caption>{ages[i]}</Caption><p className="mt-3 text-sm leading-7">{x}</p></div>)}</div></section>;
}

function ConflictsLab(){
 const [pair,setPair]=useState(0),[mode,setMode]=useState(0);
 const pairs=[{title:'Хочу близости / хочу свободы',a:'Желание быть услышанным, замеченным и поддержанным.',b:'Потребность в личном пространстве, независимости и тишине.',bridge:'Договориться о времени вместе и о времени на себя — без проверки любви постоянной доступностью.'},
 {title:'Хочу перемен / боюсь потерять опору',a:'Потребность в развитии и смысле.',b:'Потребность в безопасности и стабильных ресурсах.',bridge:'Проверить возможность в небольшом масштабе, прежде чем отказываться от опоры.'},
 {title:'Хочу помочь / хочу отдохнуть',a:'Потребность в заботе и связи.',b:'Потребность в восстановлении и собственных границах.',bridge:'Определить посильную форму помощи и обозначить время для отдыха.'}];
 const p=pairs[pair];
 return <section className={panel}><Intro count="01" title="Совет двух сторон" subtitle="Не выбирай победителя до того, как выслушаешь обе потребности. Переключай голоса и попробуй найти решение без обесценивания."/>
 <PillTabs items={pairs.map(x=>x.title)} value={pair} setValue={i=>{setPair(i);setMode(0);}}/>
 <div className="mt-6 grid gap-4 md:grid-cols-2"><div className={'rounded-2xl border p-5 '+(mode===0?'border-[#f0c453] bg-[#382a1c]':'border-[#816741] bg-[#19160f]')}><Caption>Первая сторона</Caption><p className="mt-3 leading-8">{p.a}</p><button type="button" className="mt-4 text-sm text-[#f0c453] hover:underline" onClick={()=>setMode(0)}>Выслушать эту сторону →</button></div><div className={'rounded-2xl border p-5 '+(mode===1?'border-[#f0c453] bg-[#382a1c]':'border-[#816741] bg-[#19160f]')}><Caption>Вторая сторона</Caption><p className="mt-3 leading-8">{p.b}</p><button type="button" className="mt-4 text-sm text-[#f0c453] hover:underline" onClick={()=>setMode(1)}>Выслушать эту сторону →</button></div></div>
 <PillTabs items={['Защитить первое','Защитить второе','Искать третий путь']} value={mode} setValue={setMode}/>
 <Result title={mode===2?'Мост между потребностями':mode===0?'Чего боится первая сторона?':'Чего боится вторая сторона?'}><p>{mode===2?p.bridge:mode===0?'Если игнорировать эту сторону, может возникнуть чувство потери связи или упущенной возможности. Но её потребность не делает вторую сторону ложной.':'Если игнорировать эту сторону, может появиться усталость, тревога или ощущение потери контроля. Но осторожность не отменяет важность первой потребности.'}</p><p className={gold}>Можно признать обе потребности, не обещая немедленного идеального решения.</p></Result></section>;
}

function AttentionLab(){
 const [source,setSource]=useState(0),[task,setTask]=useState(0),[rest,setRest]=useState(false);
 const distractions=[{title:'Уведомления',cause:'Внешний сигнал',fix:'На короткое время выключи необязательные уведомления или убери телефон из поля зрения.'},{title:'Поток мыслей',cause:'Внутренняя мысль',fix:'Назови мысль одним предложением и мягко верни внимание к ближайшему действию.'},{title:'Много задач',cause:'Переключение контекстов',fix:'Оставь одну текущую задачу и один понятный следующий шаг.'},{title:'Усталость',cause:'Снижение ресурсов',fix:'Попробуй восстановиться. Иногда лучшее возвращение к вниманию начинается с отдыха.'}];
 return <section className={panel}><Intro count="01" title="Куда утекает внимание?" subtitle="Вместо привычного дневника — интерактивная карта переключений. Найди источник отвлечения, выбранную цель и подходящий способ вернуться."/>
 <Caption>Что чаще всего перехватывает фокус?</Caption><div className="mt-4 grid gap-3 sm:grid-cols-2">{distractions.map((v,i)=><Chip key={i} label={v.title} picked={source===i} onClick={()=>setSource(i)}/>)}</div>
 <Caption>Куда хотелось бы направить внимание?</Caption><PillTabs items={['Разговор','Работа / учёба','Отдых','Прогулка / момент']} value={task} setValue={setTask}/>
 <label className="mt-7 flex cursor-pointer items-center gap-3 rounded-xl border border-[#856944] bg-[#19160f] p-4 text-sm leading-6"><input type="checkbox" checked={rest} onChange={e=>setRest(e.target.checked)} className="h-5 w-5 accent-[#f0c453]"/>Сейчас я чувствую усталость и, возможно, нуждаюсь в паузе.</label>
 <Result title={rest?'Сначала проверь потребность в восстановлении':distractions[source].cause}><p>{rest?'Отдых не является «отвлечением», которое нужно обязательно победить. Усталость может снижать способность фокусироваться.':distractions[source].fix}</p><p className={gold}>Ориентир: {['слушать собеседника и проверять, что услышал','закончить одну понятную часть задачи','позволить себе отдых без параллельной работы','заметить окружающие звуки, движение или свет'][task]}.</p></Result></section>;
}

export default function ExploreDeepExperience({slug}){
 const C={relationships:RelationshipDepth,body:BodyDepth,choice:ChoiceDepth,beliefs:BeliefLab,values:ValuesLab,fears:FearLab,time:TimeLab,conflicts:ConflictsLab,attention:AttentionLab}[slug];
 return C?<C/>:null;
}
