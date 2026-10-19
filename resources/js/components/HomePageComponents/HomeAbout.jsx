export default function HomeAbout({ about }) {
    // თუ არ მოვიდა მონაცემი ან არააქტიურია — არ დავარენდეროთ
    if (!about || about.is_active === false) return null;

    return (
        <section className="py-12 md:py-32 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/5 blur-[120px] rounded-full translate-x-1/2"></div>

            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-7 md:gap-12 lg:gap-16 items-center">
                <div className="lg:col-span-5 flex justify-center lg:justify-center">
                    <div className="relative group">
                        <div className="size-60 sm:size-72 md:size-96 lg:size-[420px] rounded-full p-1 border border-primary/20 portrait-glow transition-all duration-700 group-hover:border-primary/40 overflow-hidden">
                            <img loading="lazy"
                                alt={about.image_alt || about.kicker || "About image"}
                                className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-1000 transform scale-105 group-hover:scale-100"
                                src={about.about_image_url || ""}
                            />
                        </div>

                        <div className="absolute -inset-2 border border-primary/5 rounded-full -z-10 animate-[pulse_6s_ease-in-out_infinite]"></div>
                    </div>
                </div>

                <div className="lg:col-span-7 space-y-5 md:space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-primary text-sm font-bold tracking-[0.2em] uppercase">
                            {about.kicker}
                        </h2>

                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-xl">
                            {about.title}
                        </h3>
                    </div>

                    <div className="space-y-4 md:space-y-6 max-w-2xl">
                        <p className="text-sm md:text-lg text-slate-400 font-light leading-[1.85] md:leading-relaxed">
                            {about.paragraph_1}
                        </p>

                        <p className="text-sm md:text-lg text-slate-400 font-light leading-[1.85] md:leading-relaxed">
                            {about.paragraph_2}
                        </p>
                    </div>

                    <div className="pt-4 grid grid-cols-3 gap-2 md:gap-6">
                        <div className="space-y-1">
                            <div className="text-2xl sm:text-3xl md:text-2xl sm:text-3xl md:text-4xl font-light text-primary">{about.stat_1_value}</div>
                            <div className="text-[9px] sm:text-[10px] leading-snug break-words text-slate-400 uppercase tracking-[0.15em] font-semibold">
                                {about.stat_1_label}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-light text-primary">{about.stat_2_value}</div>
                            <div className="text-[9px] sm:text-[10px] leading-snug break-words text-slate-400 uppercase tracking-[0.15em] font-semibold">
                                {about.stat_2_label}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-light text-primary">{about.stat_3_value}</div>
                            <div className="text-[9px] sm:text-[10px] leading-snug break-words text-slate-400 uppercase tracking-[0.15em] font-semibold">
                                {about.stat_3_label}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
