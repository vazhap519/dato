import { router } from "@inertiajs/react";

export default function HomePractice({ practiceSection }) {
    if (!practiceSection) return null;

    const { header_big, header_small, content = [] } = practiceSection;
    const free = {
        title: practiceSection.free_title || "Бесплатный практикум «Познай себя»",
        description: practiceSection.free_description || "Три дня, чтобы лучше понять себя через наблюдение, вопросы и практические задания.",
        url: practiceSection.free_button_url || "/editoria",
        button_text: practiceSection.free_button_text || "Начать бесплатно",
        image: practiceSection.free_image,
        is_free: true,
    };
    const items = [...(practiceSection.free_enabled === false ? [] : [free]), ...content.slice(0, 2)];

    return (
        <section id="interaction-formats" className="scroll-mt-24 py-12 md:py-24 bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-8 md:mb-14">
                    <h2 className="text-primary text-xs md:text-sm font-bold tracking-widest uppercase mb-4">
                        {header_small ?? "Предложения"}
                    </h2>
                    <h3 className="text-2xl md:text-4xl font-bold max-w-xl">
                        {header_big ?? "Продукты и услуги"}
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {items.map((item, index) => (
                        <article key={index} className="group flex flex-col min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-card-dark transition-colors hover:border-primary/40">
                            <div className="relative h-52 sm:h-60 md:h-52 lg:h-56 overflow-hidden bg-[#1c1711]" aria-hidden="true">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt=""
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-cover object-left md:object-center transition-transform duration-700 group-hover:scale-[1.035]"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(226,166,68,0.27),transparent_70%),linear-gradient(135deg,#352718,#15120e)]" />
                                )}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#241d12]/70 via-transparent to-[#16120c]/10" />
                                <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#1c1711]/30 to-transparent" />
                                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#1c1711]/30 to-transparent" />
                                {item.is_free && (
                                    <span className="absolute top-3 left-3 rounded-md bg-primary px-2.5 py-1.5 text-[10px] font-black uppercase text-background-dark">
                                        Начни здесь · Бесплатно
                                    </span>
                                )}
                                {!item.is_free && item.is_premium && (
                                    <span className="absolute top-3 left-3 rounded-md bg-primary px-2.5 py-1.5 text-[10px] font-black uppercase text-background-dark">Premium</span>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-6 lg:p-7">
                                <h4 className="mb-3 text-xl md:text-xl lg:text-2xl font-bold leading-snug">{item.title}</h4>
                                <p className="mb-6 flex-1 text-sm md:text-base leading-relaxed text-slate-400">{item.description}</p>
                                <button
                                    type="button"
                                    onClick={() => item.url && router.visit(item.url)}
                                    className="btn-primary-unified w-full !py-3 text-center text-sm md:text-base"
                                >
                                    {item.is_free ? item.button_text : "Подробнее"}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
