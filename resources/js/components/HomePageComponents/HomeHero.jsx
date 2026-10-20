export default function HomeHero({hero}) {
    if (!hero) return null;

    return (
        <section className="relative min-h-0 lg:min-h-[90vh] flex items-center overflow-hidden hero-gradient">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 items-center w-full">
                <div className="z-10 space-y-5 md:space-y-8 pt-8 pb-3 lg:py-12">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
<span className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
</span>
                        {/*Внутреннее пробуждение*/}
                        {hero.badge_text}
                    </div>
                    <h1 className="text-[clamp(2.8rem,12vw,4rem)] md:text-8xl font-light leading-tight">
                        {hero.title_line_1} <br/>
                        <span className="font-extrabold text-primary text-[0.78em] md:text-[0.72em] whitespace-nowrap"> {hero.title_highlight}</span>
                    </h1>

                    <p className="text-base md:text-2xl text-slate-400 max-w-lg leading-relaxed font-light italic">
                        {hero.subtitle || "Книги, практикумы и живые разговоры для тех, кто хочет лучше понять себя, выйти из привычных сценариев и начать жить осознаннее."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                        <a
                            href={hero.primary_button_href || "/editoria"}
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
                    </div>
                </div>

                {/* <div className="relative h-[230px] sm:h-[330px] lg:h-[80vh] flex justify-center items-end bg-transparent">
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10"></div>
                    <img   loading="eager"
                           fetchpriority="high"
                           decoding="async"  alt="David Arutyunov" className="h-full w-full object-cover object-top rounded-t-[100px] bg-transparent"


                         src={hero?.hero_image_url ?? "/images/placeholder.webp"}/>
                </div> */}



<div className="relative lg:h-[80vh] flex justify-center items-end">
<img alt="Давид Арутюнов" className="h-full w-auto max-w-full object-contain object-bottom pointer-events-none" 
src={hero?.hero_image_url ?? "/images/placeholder.webp"}/>
</div>

            </div>
        </section>
    )
}
