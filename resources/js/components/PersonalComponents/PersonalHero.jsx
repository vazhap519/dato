export default function PersonalHero({ personal }) {
    const primary = personal.hero_primary_button_url?.trim() || "#pricing";
    const secondary = personal.hero_secondary_button_url?.trim() || "#about";

    return (
        <section className="relative isolate overflow-hidden px-5 pt-6 pb-14 sm:px-8 md:pt-10 md:pb-16 lg:px-14 xl:px-20">
            <div className="absolute inset-0 cinematic-glow pointer-events-none" />
            {/* Decorative gold ribbons are vector shapes, not a flattened screenshot. */}
            <svg className="pointer-events-none absolute inset-x-0 top-0 h-[270px] w-full opacity-70 sm:h-[340px] lg:h-[400px]" viewBox="0 0 1440 400" preserveAspectRatio="none" fill="none" aria-hidden="true">
                <defs>
                    <linearGradient id="consultation-ribbon" x1="0" y1="0" x2="1440" y2="280" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#E8A820" stopOpacity="0" />
                        <stop offset=".25" stopColor="#F8C64C" stopOpacity=".65" />
                        <stop offset=".58" stopColor="#C48A1B" stopOpacity=".16" />
                        <stop offset=".88" stopColor="#FFD56A" stopOpacity=".7" />
                        <stop offset="1" stopColor="#D99A20" stopOpacity=".08" />
                    </linearGradient>
                </defs>
                <path d="M-90 12 C120 168 226 -48 442 50 S744 234 943 103 S1232 36 1530 170" stroke="url(#consultation-ribbon)" strokeWidth="1.6" />
                <path d="M-70 34 C153 188 230 -18 462 75 S762 256 963 123 S1260 60 1520 196" stroke="url(#consultation-ribbon)" strokeWidth=".7" opacity=".55" />
                <path d="M-80 3 C160 133 260 -63 470 26 S765 202 975 79 S1264 15 1530 142" stroke="url(#consultation-ribbon)" strokeWidth=".7" opacity=".45" />
                <path d="M1040 -50 C1160 50 1360 55 1450 170 S1410 340 1310 405" stroke="url(#consultation-ribbon)" strokeWidth="1.3" opacity=".65" />
                <path d="M1080 -70 C1200 42 1370 70 1470 190 S1440 340 1330 420" stroke="url(#consultation-ribbon)" strokeWidth=".7" opacity=".4" />
                {[[145,54,1.5],[320,80,1],[586,95,1.2],[813,164,1.5],[1010,86,1],[1260,114,1.5],[1355,224,1],[1150,41,1]].map(([cx,cy,r], i) => (
                    <circle key={i} cx={cx} cy={cy} r={r} fill="#F8C64C" opacity=".65" />
                ))}
            </svg>
            <svg className="pointer-events-none absolute right-0 top-[30%] hidden h-[60%] w-[32%] opacity-40 lg:block" viewBox="0 0 460 560" preserveAspectRatio="none" fill="none" aria-hidden="true">
                <path d="M490 -35 C335 105 470 177 345 292 S168 419 470 590" stroke="#D8A02B" strokeWidth="1.3" opacity=".7" />
                <path d="M510 -10 C370 115 490 195 363 309 S200 429 495 565" stroke="#F6C651" strokeWidth=".7" opacity=".6" />
                <path d="M470 15 C365 125 450 200 320 320 S180 445 450 575" stroke="#A8781C" strokeWidth=".7" opacity=".5" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-primary/[0.025] to-transparent pointer-events-none" aria-hidden="true" />
            <div className="relative max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-7 lg:gap-4 xl:gap-8 items-center">
                <div className="contents lg:relative lg:z-20 lg:flex lg:flex-col lg:gap-7 lg:min-w-0">
                    {personal.hero_badge && (
                        <div className="order-1 inline-flex items-center gap-2 bg-primary/10 border border-primary/25 px-4 py-2 rounded-full w-fit">
                            <span className="material-symbols-outlined text-primary text-base" aria-hidden="true">schedule</span>
                            <span className="text-primary text-[11px] sm:text-xs font-semibold uppercase tracking-wider">{personal.hero_badge}</span>
                        </div>
                    )}
                    <h1 className="order-2 text-[clamp(2.15rem,8.5vw,3.25rem)] sm:text-5xl xl:text-[3.65rem] font-bold leading-[1.12] tracking-tight text-white max-w-[660px]">
                        {personal.hero_title_line_1}{" "}
                        <span className="text-primary">{personal.hero_title_highlight}</span>{" "}
                        {personal.hero_title_line_2}
                    </h1>
                    <p className="order-3 text-[15px] sm:text-base md:text-lg text-white/70 max-w-[590px] leading-[1.8]">
                        {personal.hero_description}
                    </p>
                    <div className="order-5 flex flex-col sm:flex-row flex-wrap gap-3 mt-1 lg:mt-0">
                        <a href={primary} className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-background-dark px-7 py-4 rounded-xl font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-primary/15 hover:shadow-primary/25 w-full sm:w-auto">
                            {personal.hero_primary_button_text || "Записаться на встречу"}
                        </a>
                        <a href={secondary} className="group inline-flex items-center gap-2 justify-center px-4 py-4 text-white/90 hover:text-primary font-semibold transition-colors">
                            {personal.hero_secondary_button_text || "Как проходит встреча"}
                            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                        </a>
                    </div>
                    <div className="hidden lg:flex lg:order-6 flex-wrap items-center gap-x-4 gap-y-2 text-white/70 text-sm rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-3.5 w-fit">
                        <span className="inline-flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base" aria-hidden="true">schedule</span>60 минут</span>
                        <span className="text-primary/40" aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base" aria-hidden="true">videocam</span>Онлайн</span>
                        <span className="text-primary/40" aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base" aria-hidden="true">forum</span>Личный разговор</span>
                    </div>
                </div>
                <div className="order-4 lg:order-2 relative w-full max-w-[660px] mx-auto lg:mr-0 lg:-ml-6 xl:-ml-12">
                    <div className="relative w-full h-[310px] min-[390px]:h-[390px] sm:h-[470px] lg:h-[550px] xl:h-[590px]">
                        <div className="absolute inset-[14%] bg-primary/15 blur-[90px] pointer-events-none" aria-hidden="true" />
                        
                        
                        {personal.hero_image && (
                            <img loading="eager" fetchPriority="high" decoding="async"
                                src={personal.hero_image}
                                alt={personal.hero_author_name || "Давид Арутюнов"}
                                className="absolute z-10 bottom-[-4%] right-[-16%] w-[145%] max-w-none h-auto max-h-none object-contain object-bottom sm:right-[-10%] sm:w-[138%] lg:right-[-3%] lg:bottom-[-7%] lg:w-[120%] xl:right-[-4%] xl:w-[125%] [mask-image:linear-gradient(to_bottom,black_0%,black_72%,transparent_100%)] drop-shadow-[0_18px_32px_rgba(0,0,0,0.25)]"
                            />
                        )}
                    </div>
                    <div className="hidden lg:block relative z-30 -mt-10 sm:-mt-12 lg:-mt-20 px-1 sm:px-5 lg:pl-16 lg:pr-3">
                        <p className="text-primary font-bold text-lg sm:text-xl">{personal.hero_author_name}</p>
                        <p className="text-white/80 text-sm italic">{personal.hero_author_role}</p>
                        <div className="mt-3 h-px w-32 bg-gradient-to-r from-primary/60 to-transparent" aria-hidden="true" />
                    </div>
                </div>
                <div className="order-6 lg:hidden flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-white/70 text-xs sm:text-sm rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5">
                    <span>60 минут</span><span className="text-primary/50" aria-hidden="true">·</span>
                    <span>Онлайн</span><span className="text-primary/50" aria-hidden="true">·</span>
                    <span>Личный разговор</span>
                </div>
            </div>
        </section>
    );
}
