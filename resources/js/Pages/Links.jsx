import { Head, usePage } from "@inertiajs/react";

export default function Links() {
    const { links = [], settings = {} } = usePage().props;
    return (
        <>
            <Head title="Полезные ссылки — Давид Арутюнов">
                <meta name="description" content="Все полезные ссылки Давида Арутюнова: практикумы, сообщество, книги и социальные сети." />
            </Head>
            <main className="relative min-h-screen overflow-hidden bg-[#17140e] px-5 pb-16 pt-12 text-white">
                <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#f8c83c]/[0.09] blur-[100px]" />
                <div className="relative mx-auto flex w-full max-w-[480px] flex-col items-center">
                    <a href="/" aria-label="На главную" className="mb-9 inline-flex items-center justify-center">
                        {settings?.logo ? <img src={settings.logo} alt="Arutyun" className="h-14 max-w-[210px] object-contain" /> : <span className="font-serif text-4xl italic text-[#f8c83c]">Arutyun</span>}
                    </a>
                    <div className="mb-4 h-px w-20 bg-gradient-to-r from-transparent via-[#f8c83c] to-transparent" />
                    <h1 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">Давид Арутюнов</h1>
                    <p className="mb-9 mt-2 text-center text-sm text-[#bdb4a3]">Мир проще, чем кажется.</p>
                    <div className="flex w-full flex-col gap-3">
                        {links.map((item) => {
                            const external = /^https?:\/\//i.test(item.url);
                            return (
                                <a key={item.id} href={item.url} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
                                   className="group flex min-h-[76px] items-center gap-4 rounded-2xl border border-[#63502a]/60 bg-gradient-to-r from-[#2b2417] to-[#211d15] px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#f8c83c]/70 hover:bg-[#342a18] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f8c83c]">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f8c83c]/10" aria-hidden="true"><span className="material-symbols-outlined block text-center text-[25px] leading-none text-[#f8c83c]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>{item.icon || "link"}</span></span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-[15px] font-semibold leading-snug">{item.title}</span>
                                        {item.description && <span className="mt-1 block text-xs leading-relaxed text-[#bdb4a3]">{item.description}</span>}
                                    </span>
                                    <span className="material-symbols-outlined text-xl text-[#f8c83c] transition-transform group-hover:translate-x-1" aria-hidden="true">arrow_outward</span>
                                </a>
                            );
                        })}
                        {links.length === 0 && <p className="rounded-2xl border border-white/10 p-6 text-center text-sm text-[#bdb4a3]">Скоро здесь появятся полезные ссылки.</p>}
                    </div>
                    <section aria-labelledby="open-browser-title" className="mt-14 w-full border-t border-[#63502a]/50 pt-10">
                        <div className="mb-7 text-center">
                            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#f8c83c]/25 bg-[#f8c83c]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#f8c83c]">
                                <span className="material-symbols-outlined text-base" aria-hidden="true">open_in_browser</span>
                                Важно
                            </span>
                            <h2 id="open-browser-title" className="text-xl font-bold sm:text-2xl">Как открыть ссылки</h2>
                            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#bdb4a3]">
                                Если ты открыл эту страницу через TikTok, Instagram или другое приложение, некоторые ссылки могут не работать во встроенном браузере.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-[#63502a]/60 bg-gradient-to-b from-[#2b2417] to-[#1e1a13] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.2)] sm:p-6">
                            <div className="mx-auto max-w-[330px] overflow-hidden rounded-[22px] border border-[#7b6332]/60 bg-[#17140e] shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
                                <div className="flex items-center justify-between border-b border-[#63502a]/40 bg-[#292318] px-4 py-3">
                                    <span className="flex items-center gap-2 text-xs text-white/75"><span className="material-symbols-outlined text-base" aria-hidden="true">arrow_back</span> Встроенный браузер</span>
                                    <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#f8c83c]/60 bg-[#f8c83c]/15 text-[#f8c83c]">
                                        <span className="material-symbols-outlined" aria-hidden="true">more_horiz</span>
                                        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#f8c83c] text-[11px] font-bold text-[#17140e]">1</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2 px-4 py-7">
                                    <span className="font-serif text-2xl italic text-[#f8c83c]">Arutyun</span>
                                    <span className="text-xs text-[#bdb4a3]">Полезные ссылки</span>
                                    <span className="material-symbols-outlined mt-3 text-4xl text-[#f8c83c]" aria-hidden="true">south</span>
                                </div>
                                <div className="mx-3 mb-3 rounded-xl border border-[#f8c83c]/45 bg-[#3a2d16] p-3">
                                    <div className="flex items-center gap-3">
                                        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f8c83c]/20 text-[#f8c83c]">
                                            <span className="material-symbols-outlined" aria-hidden="true">open_in_browser</span>
                                            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#f8c83c] text-[11px] font-bold text-[#17140e]">2</span>
                                        </span>
                                        <span className="text-sm font-semibold">Открыть в браузере</span>
                                        <span className="material-symbols-outlined ml-auto text-[#f8c83c]" aria-hidden="true">north_east</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 space-y-3">
                                <p className="flex items-start gap-3 text-sm leading-relaxed"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f8c83c] text-xs font-bold text-[#17140e]">1</span><span>Нажми на <strong className="text-white">три точки (⋯)</strong> или значок меню в верхнем углу встроенного браузера.</span></p>
                                <p className="flex items-start gap-3 text-sm leading-relaxed"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f8c83c] text-xs font-bold text-[#17140e]">2</span><span>Выбери <strong className="text-white">«Открыть в браузере»</strong> — страница откроется в Chrome, Safari или другом браузере.</span></p>
                            </div>
                            <p className="mt-5 text-center text-xs leading-relaxed text-[#a99b82]">Название и расположение пунктов могут отличаться в разных приложениях.</p>
                        </div>
                    </section>
                    <a href="/" className="mt-10 text-sm text-[#bdb4a3] underline-offset-4 transition hover:text-[#f8c83c] hover:underline">Перейти на основной сайт</a>
                    <p className="mt-8 text-xs text-[#746c5c]">© Arutyun</p>
                </div>
            </main>
        </>
    );
}
