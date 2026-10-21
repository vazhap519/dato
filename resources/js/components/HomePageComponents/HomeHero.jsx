export default function HomeHero({ hero }) {
    if (!hero) return null;

    const imageUrl = hero.hero_image_url || "/images/placeholder.webp";

    const actions = (
        <>
            <a
                href="#interaction-formats"
                className="bg-primary text-background-dark px-5 md:px-10 py-3.5 md:py-4 rounded-xl text-sm md:text-lg font-bold hover:shadow-[0_0_20px_rgba(250,198,56,0.3)] transition-all text-center"
            >
                {hero.primary_button_text || "Начать с бесплатного практикума"}
            </a>
            <a
                href={hero.secondary_button_href || "#about"}
                className="border border-white/10 hover:bg-white/5 px-5 md:px-10 py-3.5 md:py-4 rounded-xl text-sm md:text-lg font-medium transition-all text-center"
            >
                {hero.secondary_button_text || "Узнать обо мне"}
            </a>
        </>
    );

    return (
        <section className="relative overflow-hidden hero-gradient lg:min-h-[90vh] lg:flex lg:items-center">
            <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-0 px-6 lg:grid-cols-2 lg:gap-12">
                <div className="relative z-10 pt-24 text-center sm:pt-28 lg:py-12 lg:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                        </span>
                        {hero.badge_text}
                    </div>

                    <h1 className="mt-5 text-[clamp(2.55rem,10vw,4rem)] font-light leading-[1.12] md:text-8xl lg:mt-8">
                        {hero.title_line_1}
                        <br />
                        <span className="whitespace-nowrap text-[0.78em] font-extrabold text-primary md:text-[0.72em]">
                            {hero.title_highlight}
                        </span>
                    </h1>

                    <p className="mx-auto mt-5 max-w-lg text-base font-light italic leading-relaxed text-slate-400 md:text-2xl lg:mx-0 lg:mt-8">
                        {hero.subtitle || "Книги, практикумы и живые разговоры для тех, кто хочет лучше понять себя, выйти из привычных сценариев и начать жить осознаннее."}
                    </p>

                    <div className="hidden flex-col gap-3 pt-6 sm:flex-row md:gap-4 lg:flex">
                        {actions}
                    </div>
                </div>

                <div className="relative mx-auto mt-3 h-[390px] w-[calc(100%+3rem)] max-w-[520px] sm:h-[490px] lg:mt-0 lg:h-[80vh] lg:w-full lg:max-w-none">
                    {/* Mobile glow continues beyond the source image, avoiding a visible rectangular edge. */}
                    <div className="pointer-events-none absolute inset-[-12%] rounded-full bg-[radial-gradient(ellipse_at_60%_55%,rgba(178,112,27,0.23)_0%,rgba(105,66,19,0.12)_35%,transparent_70%)] lg:hidden" />
                    <img
                        src={imageUrl}
                        alt="Давид Арутюнов"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        className="pointer-events-none absolute inset-0 h-full w-full object-contain object-center [mask-image:radial-gradient(ellipse_78%_77%_at_52%_49%,black_66%,transparent_100%)] lg:object-bottom lg:[mask-image:linear-gradient(to_right,transparent_0%,black_12%,black_88%,transparent_100%),linear-gradient(to_bottom,black_0%,black_78%,transparent_100%)] lg:[mask-composite:intersect] lg:[-webkit-mask-composite:source-in]"
                    />
                    <div className="pointer-events-none absolute left-[3%] top-[49%] z-10 w-[31%] text-left text-[clamp(1.05rem,4.5vw,1.5rem)] font-semibold italic leading-[1.15] tracking-tight text-primary drop-shadow-[0_2px_10px_rgba(0,0,0,1)] lg:hidden">
                        Всё<br />начинается<br />с тебя
                        <svg className="mt-1 h-7 w-full overflow-visible text-primary" viewBox="0 0 120 28" fill="none" aria-hidden="true">
                            <path d="M2 20 Q 55 2 109 17 M98 8 L109 17 L96 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <div className="relative z-10 -mt-7 flex flex-col gap-3 pb-8 sm:mx-auto sm:w-full sm:max-w-[420px] lg:hidden">
                    {actions}
                </div>
            </div>
        </section>
    );
}
