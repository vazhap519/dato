export default function ClosedGroupHero({ group }) {
    return (
        <section className="relative isolate w-full overflow-hidden">
            <div className="absolute inset-0 glow-overlay pointer-events-none" aria-hidden="true" />
            <div className="pointer-events-none absolute right-[-12%] top-[4%] h-[75%] w-[68%] rounded-full bg-primary/[0.07] blur-[110px] hidden lg:block" aria-hidden="true" />
            <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-5 px-6 pb-12 pt-8 sm:px-8 md:gap-8 md:py-14 lg:min-h-[700px] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-0 lg:px-12 xl:px-16">
                <div className="relative z-20 flex flex-col items-start gap-5 lg:gap-7">
                    {group.hero_badge && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(245,185,42,0.6)]" aria-hidden="true" />
                            {group.hero_badge}
                        </div>
                    )}
                    <h1 className="max-w-[760px] text-[clamp(2.6rem,7vw,4.5rem)] font-display font-medium leading-[1.07] tracking-tight text-white">
                        {group.hero_title}
                        <span className="mt-1 block text-primary/95 italic">{group.hero_title_highlight}</span>
                    </h1>
                    <p className="max-w-[590px] whitespace-pre-line text-[15px] leading-[1.8] text-white/80 sm:text-base lg:text-[17px]">
                        {group.hero_description}
                    </p>
                    <div className="order-2 flex w-full flex-col flex-wrap gap-3 pt-1 sm:w-auto sm:flex-row lg:order-none">
                        <a href="#pricing" className="inline-flex items-center justify-center rounded-xl bg-primary px-7 py-4 font-bold text-background-dark shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5 hover:brightness-110">
                            {group.hero_button_primary || "Присоединиться"}
                        </a>
                        <a href="#program" className="inline-flex items-center justify-center rounded-xl border border-white/20 px-7 py-4 font-bold text-white transition-all hover:border-primary/40 hover:bg-white/5 hover:text-primary">
                            {group.hero_button_secondary || "Что внутри"}
                        </a>
                    </div>
                    <p className="text-sm text-gray-400">Материалы · Практики · Общение</p>
                </div>
                <div className="relative -mx-6 h-[370px] overflow-visible sm:mx-0 sm:h-[490px] lg:-ml-20 lg:-mr-24 lg:h-[680px] xl:-ml-28 xl:-mr-32">
                    {group.hero_image_url && (
                        <img
                            src={group.hero_image_url}
                            alt={group.hero_title || "Круг души"}
                            loading="eager"
                            fetchPriority="high"
                            className="absolute inset-0 h-full w-full object-cover object-center [mask-image:radial-gradient(ellipse_72%_72%_at_53%_49%,black_43%,transparent_100%)] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_23%,black_77%,transparent_100%)]"
                        />
                    )}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#19160f]/40 to-transparent" aria-hidden="true" />
                </div>
            </div>
        </section>
    );
}
