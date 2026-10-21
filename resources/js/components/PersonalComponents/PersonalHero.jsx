export default function PersonalHero({ personal }) {
    const primary = personal.hero_primary_button_url?.trim() || "#pricing";
    const secondary = personal.hero_secondary_button_url?.trim() || "#about";

    return (
        <section className="relative isolate overflow-hidden px-5 pt-8 pb-14 sm:px-8 md:py-16 lg:px-14 xl:px-20">
            <div className="absolute inset-0 cinematic-glow pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-primary/[0.025] to-transparent pointer-events-none" aria-hidden="true" />
            <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-7 lg:gap-4 xl:gap-8 items-center">
                <div className="order-1 relative z-20 flex flex-col gap-5 md:gap-7 min-w-0">
                    {personal.hero_badge && (
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 px-4 py-2 rounded-full w-fit">
                            <span className="material-symbols-outlined text-primary text-base" aria-hidden="true">schedule</span>
                            <span className="text-primary text-[11px] sm:text-xs font-semibold uppercase tracking-wider">{personal.hero_badge}</span>
                        </div>
                    )}
                    <h1 className="text-[clamp(2.15rem,8.5vw,3.25rem)] sm:text-5xl xl:text-[3.65rem] font-bold leading-[1.12] tracking-tight text-white max-w-[660px]">
                        {personal.hero_title_line_1}{" "}
                        <span className="text-primary">{personal.hero_title_highlight}</span>{" "}
                        {personal.hero_title_line_2}
                    </h1>
                    <p className="text-[15px] sm:text-base md:text-lg text-white/70 max-w-[590px] leading-[1.8]">
                        {personal.hero_description}
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                        <a href={primary} className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-background-dark px-7 py-4 rounded-xl font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-primary/15 hover:shadow-primary/25 w-full sm:w-auto">
                            {personal.hero_primary_button_text || "Записаться на встречу"}
                        </a>
                        <a href={secondary} className="group inline-flex items-center gap-2 justify-center px-4 py-4 text-white/90 hover:text-primary font-semibold transition-colors">
                            {personal.hero_secondary_button_text || "Как проходит встреча"}
                            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                        </a>
                    </div>
                    <div className="hidden lg:flex flex-wrap items-center gap-x-4 gap-y-2 text-white/70 text-sm rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-3.5 w-fit">
                        <span className="inline-flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base" aria-hidden="true">schedule</span>60 минут</span>
                        <span className="text-primary/40" aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base" aria-hidden="true">videocam</span>Онлайн</span>
                        <span className="text-primary/40" aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base" aria-hidden="true">forum</span>Личный разговор</span>
                    </div>
                </div>
                <div className="order-2 relative w-full max-w-[660px] mx-auto lg:mr-0 lg:-ml-6 xl:-ml-12">
                    <div className="relative w-full h-[330px] min-[390px]:h-[390px] sm:h-[470px] lg:h-[550px] xl:h-[590px]">
                        <div className="absolute inset-[7%] rounded-full bg-primary/20 blur-[65px] pointer-events-none" aria-hidden="true" />
                        <div className="absolute w-[60%] aspect-square right-[9%] top-[13%] rounded-full border border-primary/25 shadow-[0_0_75px_rgba(245,185,42,0.12)] pointer-events-none" aria-hidden="true" />
                        <div className="absolute w-[66%] aspect-square right-[6%] top-[11%] rounded-full bg-[radial-gradient(circle,rgba(245,185,42,0.19),transparent_72%)] pointer-events-none" aria-hidden="true" />
                        {personal.hero_image && (
                            <img loading="eager" fetchPriority="high" decoding="async"
                                src={personal.hero_image}
                                alt={personal.hero_author_name || "Давид Арутюнов"}
                                className="absolute z-10 bottom-[-4%] right-[-16%] w-[145%] max-w-none h-auto max-h-none object-contain object-bottom sm:right-[-10%] sm:w-[138%] lg:right-[-3%] lg:bottom-[-7%] lg:w-[120%] xl:right-[-4%] xl:w-[125%] [mask-image:linear-gradient(to_bottom,black_0%,black_72%,transparent_100%)] drop-shadow-[0_18px_32px_rgba(0,0,0,0.25)]"
                            />
                        )}
                    </div>
                    <div className="relative z-30 -mt-10 sm:-mt-12 lg:-mt-20 px-1 sm:px-5 lg:pl-16 lg:pr-3">
                        <p className="text-primary font-bold text-lg sm:text-xl">{personal.hero_author_name}</p>
                        <p className="text-white/80 text-sm italic">{personal.hero_author_role}</p>
                        <div className="mt-3 h-px w-32 bg-gradient-to-r from-primary/60 to-transparent" aria-hidden="true" />
                    </div>
                </div>
                <div className="order-3 lg:hidden flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-white/70 text-xs sm:text-sm rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5">
                    <span>60 минут</span><span className="text-primary/50" aria-hidden="true">·</span>
                    <span>Онлайн</span><span className="text-primary/50" aria-hidden="true">·</span>
                    <span>Личный разговор</span>
                </div>
            </div>
        </section>
    );
}
