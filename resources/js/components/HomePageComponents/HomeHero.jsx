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
            <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-0 px-0 lg:grid-cols-2 lg:gap-12 lg:px-6">
                <div className="relative z-10 w-full min-w-0 px-6 pt-8 text-center sm:pt-12 lg:px-0 lg:py-12 lg:text-left">
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

                {/* The mobile portrait, callout and CTAs form one responsive composition. */}
                <div className="relative mx-auto -mt-1 w-full max-w-[540px] lg:mt-0 lg:h-[80vh] lg:w-full lg:max-w-none">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_55%,rgba(174,104,24,0.26),transparent_72%)] lg:hidden" />
                    <img
                        src={imageUrl}
                        alt="Давид Арутюнов"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        className="pointer-events-none relative block h-auto w-full origin-center translate-x-[5%] scale-[1.06] [mask-image:linear-gradient(to_right,transparent_0%,black_12%,black_88%,transparent_100%),linear-gradient(to_bottom,transparent_0%,black_12%,black_75%,transparent_100%)] [mask-composite:intersect] [-webkit-mask-composite:source-in] lg:absolute lg:inset-0 lg:translate-x-0 lg:scale-100 lg:h-full lg:object-contain lg:object-bottom lg:[mask-image:linear-gradient(to_right,transparent_0%,black_12%,black_88%,transparent_100%),linear-gradient(to_bottom,black_0%,black_78%,transparent_100%)] lg:[mask-composite:intersect] lg:[-webkit-mask-composite:source-in]"
                    />
                    {/* Mobile callout positioned near the pointing hand, away from the face. */}
                    <div className="pointer-events-none absolute left-[5%] top-[41.5%] z-10 w-[35%] text-left text-[clamp(0.95rem,4.2vw,1.3rem)] font-semibold italic leading-[1.12] tracking-tight text-[#f5c65c] [text-shadow:0_2px_8px_rgba(0,0,0,0.7)] lg:hidden">
                        <span className="block">Всё</span>
                        <span className="block">начинается</span>
                        <span className="block">с тебя</span>
                    </div>
                    {/* Buttons float over the fading bottom of the portrait, not below a framed image. */}
                    <div className="relative z-20 mx-auto -mt-[17%] flex w-[calc(100%-3rem)] max-w-[420px] flex-col gap-3 pb-8 lg:hidden">
                        {actions}
                    </div>
                </div>
            </div>
        </section>
    );
}
