import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

const emotions = [
    { name: 'Тревога', icon: 'air', color: 'Ожидание неопределённости', question: 'Чего именно я боюсь и что мне известно наверняка?', practice: 'Назови пять предметов вокруг себя. Заметь опору под ногами и сделай несколько спокойных выдохов.' },
    { name: 'Злость', icon: 'local_fire_department', color: 'Сигнал о границах', question: 'Какая моя граница или потребность сейчас затронута?', practice: 'Прежде чем отвечать, сделай паузу. Сформулируй одну просьбу без обвинений.' },
    { name: 'Грусть', icon: 'water_drop', color: 'Внимание к утрате', question: 'О чём важном для меня говорит эта грусть?', practice: 'Позволь себе назвать чувство. Запиши, чего тебе сейчас не хватает.' },
    { name: 'Страх', icon: 'shield', color: 'Внимание к безопасности', question: 'Есть ли реальная опасность прямо сейчас или я представляю возможное будущее?', practice: 'Проверь факты и выбери один небольшой безопасный следующий шаг.' },
    { name: 'Зависть', icon: 'visibility', color: 'Подсказка о желаниях', question: 'Что из увиденного у другого человека на самом деле важно мне?', practice: 'Переведи сравнение в собственную цель: «Мне хотелось бы…».' },
    { name: 'Радость', icon: 'wb_sunny', color: 'Контакт с ценным', question: 'Что именно в этом моменте наполняет меня?', practice: 'Заметь три детали приятного момента и поблагодари себя за внимание к ним.' },
    { name: 'Обида', icon: 'heart_broken', color: 'Ожидание и разочарование', question: 'Чего я ожидал и говорил ли об этом прямо?', practice: 'Отдели факт от своей интерпретации и сформулируй потребность словами.' },
    { name: 'Стыд', icon: 'person', color: 'Страх оценки', question: 'Чей взгляд я сейчас представляю и насколько он справедлив?', practice: 'Опиши случившееся без слов «я плохой». Раздели поступок и свою ценность как человека.' },
];
export default function ExploreEmotions() {
    const { settings = {} } = usePage().props;
    const [selected, setSelected] = useState(null);
    const [intensity, setIntensity] = useState(5);
    const emotion = emotions.find(item => item.name === selected);
    return <div className="min-h-screen bg-[#14120d] text-[#f8f4e9]">
        <Head title="Язык эмоций — Arutyun"><meta name="description" content="Выбери эмоцию, задай себе вопрос и попробуй практику внимания." /></Head>
        <header className="border-b border-[#b99347]/25"><div className="mx-auto max-w-5xl px-5 py-5 flex justify-between items-center gap-4">
            <Link href="/" aria-label="Главная">{settings?.logo ? <img src={settings.logo} alt="Arutyun" className="h-10 max-w-[160px] object-contain" /> : <span className="text-[#f0c453] font-serif italic text-2xl">Arutyun</span>}</Link>
            <Link href="/explore" className="text-sm text-[#e4c88c]">Все направления →</Link>
        </div></header>
        <main className="mx-auto max-w-5xl px-5 py-10 sm:py-16">
            <p className="text-xs tracking-[.2em] uppercase text-[#f0c453]">Пространство самопознания</p>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Язык <span className="italic text-[#f0c453]">эмоций</span></h1>
            <p className="mt-4 max-w-2xl text-[#c4b9a6] leading-7">Эмоция — не приговор и не ошибка. Это повод заметить, что происходит внутри. Выбери чувство, которое сейчас ближе всего.</p>
            <div className="mt-9 grid grid-cols-2 sm:grid-cols-4 gap-3" role="group" aria-label="Выбери эмоцию">
                {emotions.map(item => <button type="button" key={item.name} onClick={() => setSelected(item.name)} aria-pressed={selected === item.name} className={`rounded-xl border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] ${selected === item.name ? 'bg-[#3b2b13] border-[#f0c453]' : 'bg-[#211d15] border-[#806333]/50 hover:border-[#d3a84b]'}`}>
                    <span className="material-symbols-outlined text-[#f0c453] block mb-3" aria-hidden="true">{item.icon}</span>
                    <span className="font-semibold">{item.name}</span>
                </button>)}
            </div>
            {emotion && <section aria-live="polite" className="mt-9 rounded-2xl border border-[#a17d3a]/55 bg-[#211d15] p-5 sm:p-8">
                <p className="text-xs tracking-widest uppercase text-[#e6bb59]">Что я замечаю</p>
                <h2 className="mt-2 font-serif text-3xl">{emotion.name}</h2>
                <p className="mt-2 text-[#c4b9a6]">{emotion.color} — один из возможных способов посмотреть на это чувство, не универсальное объяснение.</p>
                <label htmlFor="emotion-intensity" className="mt-7 block text-sm font-medium">Насколько сильно я чувствую это сейчас? <span className="text-[#f0c453]">{intensity} из 10</span></label>
                <input id="emotion-intensity" type="range" min="1" max="10" value={intensity} onChange={e => setIntensity(Number(e.target.value))} className="mt-3 w-full accent-[#f0c453]" />
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <div className="rounded-xl border border-[#806333]/40 p-5"><p className="text-xs uppercase tracking-wider text-[#f0c453]">Вопрос к себе</p><p className="mt-3 leading-7">{emotion.question}</p></div>
                    <div className="rounded-xl border border-[#806333]/40 p-5"><p className="text-xs uppercase tracking-wider text-[#f0c453]">Маленькая практика</p><p className="mt-3 leading-7">{emotion.practice}</p></div>
                </div>
                <p className="mt-6 text-xs text-[#aaa08f]">Это инструмент самонаблюдения, не диагностика и не замена профессиональной помощи.</p>
            </section>}
            {!emotion && <p className="mt-8 text-sm text-[#aaa08f]">Выбери эмоцию выше — вопросы и практика появятся сразу, без отправки формы.</p>}
            <div className="mt-12 border-t border-[#806333]/40 pt-8 text-center"><p className="font-serif text-xl">Не подавляй чувство. Попробуй его услышать.</p><Link href="/editoria" className="inline-block mt-5 rounded-lg bg-[#f0c453] px-6 py-3 text-sm font-semibold text-[#21180b]">Узнать о практикуме →</Link></div>
        </main>
    </div>;
}
