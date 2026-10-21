import { router } from "@inertiajs/react";

export default function HomePractice({ practiceSection }) {
    if (!practiceSection) return null;

    const { header_big, header_small, content = [] } = practiceSection;
    const free = {
        title: practiceSection.free_title || "Бесплатный практикум «Познай себя»",
        description: practiceSection.free_description || "Три дня, чтобы лучше понять себя через наблюдение, вопросы и практические задания.",
        url: practiceSection.free_button_url || "/editoria",
        button_text: practiceSection.free_button_text || "Начать бесплатно",
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
                            <div className="relative h-44 sm:h-52 md:h-48 lg:h-52 overflow-hidden bg-[#16130e]" aria-hidden="true">
                                <div className="absolute inset-0" style={{
                                    background: index === 0
                                        ? "radial-gradient(ellipse at 50% 90%, rgba(245,182,54,.25), transparent 58%), linear-gradient(135deg,#282010,#100f0c 75%)"
                                        : index === 1
                                            ? "radial-gradient(ellipse at 50% 65%,rgba(212,145,55,.26),transparent 65%),linear-gradient(135deg,#2a1d17,#100e0d)"
                                            : "radial-gradient(ellipse at 65% 50%,rgba(234,169,68,.22),transparent 65%),linear-gradient(135deg,#211a14,#0e0d0b)"
                                }} />
                                {index === 0 ? (
                                    <>
                                        <div className="absolute left-1/2 top-[22%] h-48 w-48 -translate-x-1/2 rounded-full border border-primary/70 shadow-[0_0_32px_rgba(255,196,55,.22),inset_0_0_35px_rgba(255,196,55,.08)]" />
                                        <div className="absolute inset-x-0 bottom-5 text-center text-primary font-bold text-sm sm:text-base tracking-wide">3 дня · Бесплатно · Онлайн</div>
                                    </>
                                ) : index === 1 ? (
                                    <div className="absolute inset-0 flex items-center justify-center gap-[-8px]">
                                        <div className="h-24 w-24 rounded-full border border-primary/30 bg-gradient-to-b from-[#7a552c] to-[#21170e] shadow-[0_0_50px_rgba(255,192,69,.12)]" />
                                        <div className="-ml-5 h-32 w-32 rounded-full border border-primary/60 bg-gradient-to-b from-[#ac7840] to-[#281b12] shadow-[0_0_45px_rgba(255,192,69,.18)]" />
                                        <div className="-ml-5 h-24 w-24 rounded-full border border-primary/30 bg-gradient-to-b from-[#7a552c] to-[#21170e]" />
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center gap-8">
                                        <div className="h-28 w-20 rounded-t-full rounded-b-2xl border border-primary/35 bg-gradient-to-b from-[#876037] to-[#231911] shadow-[0_0_35px_rgba(255,192,69,.12)]" />
                                        <div className="h-28 w-20 rounded-t-full rounded-b-2xl border border-primary/35 bg-gradient-to-b from-[#876037] to-[#231911] shadow-[0_0_35px_rgba(255,192,69,.12)]" />
                                    </div>
                                )}
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
