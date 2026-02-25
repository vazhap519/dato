export default function HomeHero({hero}) {
    if (!hero) return null;
console.log(hero.hero_image_url)
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden hero-gradient">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                <div className="z-10 space-y-8 py-12">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
<span className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
</span>
                        {/*Внутреннее пробуждение*/}
                        {hero.badge_text}
                    </div>
                    <h1 className="text-6xl md:text-8xl font-light leading-tight">
                        {hero.title_line_1} <br/>
                        <span className="font-extrabold text-primary"> {hero.title_highlight}</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-lg leading-relaxed font-light italic">
                        {hero.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <a
                            href={hero.primary_button_href || "#products"}
                            className="bg-primary text-background-dark px-10 py-4 rounded-xl text-lg font-bold hover:shadow-[0_0_20px_rgba(250,198,56,0.3)] transition-all text-center"
                        >
                            {hero.primary_button_text}
                        </a>

                        <a
                            href={hero.secondary_button_href || "#about"}
                            className="border border-white/10 hover:bg-white/5 px-10 py-4 rounded-xl text-lg font-medium transition-all text-center"
                        >
                            {hero.secondary_button_text}
                        </a>
                    </div>
                </div>

                <div className="relative lg:h-[80vh] flex justify-center items-end">
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10"></div>
                    <img   loading="eager"
                           fetchpriority="high"
                           decoding="async"  alt="David Arutyunov" className="h-full w-full object-cover object-top rounded-t-[100px]   transition-all duration-1000"


                         src={hero?.hero_image_url ?? "/images/placeholder.webp"}/>
                </div>
            </div>
        </section>
    )
}
