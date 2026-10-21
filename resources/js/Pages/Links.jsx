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
                    <a href="/" className="mt-10 text-sm text-[#bdb4a3] underline-offset-4 transition hover:text-[#f8c83c] hover:underline">Перейти на основной сайт</a>
                    <p className="mt-8 text-xs text-[#746c5c]">© Arutyun</p>
                </div>
            </main>
        </>
    );
}
