import { router } from "@inertiajs/react";
export default function HomePractice({ practiceSection }) {


    if (!practiceSection) return null;

    const {
        header_big,
        header_small,
        content = []
    } = practiceSection;

    
    const free = {
        title: practiceSection.free_title || "Бесплатный практикум «Познай себя»",
        description: practiceSection.free_description || "Три дня, чтобы лучше понять себя через наблюдение, вопросы и практические задания.",
        url: practiceSection.free_button_url || "/editoria",
        image: practiceSection.free_image,
        button_text: practiceSection.free_button_text || "Начать бесплатно",
        is_free: true,
    };
    const items = [...(practiceSection.free_enabled === false ? [] : [free]), ...content.slice(0, 2)];
    return (
        <section className="py-12 md:py-24 bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="flex justify-between items-end mb-7 md:mb-16">
                    <div className="max-w-xl">
                        <h2 className="text-primary text-sm font-bold tracking-widest uppercase mb-4">
                            {header_small ?? "Предложения"}
                        </h2>

                        <h3 className="text-2xl md:text-4xl font-bold">
                            {header_big ?? "Продукты и услуги"}
                        </h3>
                    </div>
                </div>

                {/* PRODUCT GRID — MAP */}
           {/* PRODUCTS — 2 ITEMS DESIGN */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8">
    {items.map((item, index) => (
        <div
            key={index}
            className="group bg-card-dark rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all flex flex-row md:flex-col min-h-36 md:min-h-0"
        >

            {/* IMAGE */}
            <div className="relative overflow-hidden w-[38%] shrink-0 md:w-full md:aspect-video">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full min-h-36 md:min-h-0 bg-gradient-to-br from-primary/20 via-card-dark to-background-dark flex items-center justify-center text-primary font-bold text-xs md:text-lg px-2 md:px-5 text-center">
                        3 дня · Бесплатно · Онлайн
                    </div>
                )}

                {item.is_free ? <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-primary text-background-dark text-[9px] md:text-xs font-black px-1.5 md:px-3 py-1 rounded uppercase">Начни здесь · Бесплатно</div> : item.is_premium && (
                    <div className="absolute top-4 left-4 bg-primary text-background-dark text-xs font-black px-3 py-1 rounded uppercase">
                        Premium
                    </div>
                )}
            </div>

            {/* CONTENT */}
            <div className="p-3.5 md:p-8 flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    <h4 className="text-base md:text-2xl font-bold mb-1 md:mb-3">
                        {item.title}
                    </h4>

                    <p className="text-slate-400 text-xs md:text-base mb-2 md:mb-6 font-light leading-relaxed line-clamp-3 md:line-clamp-none">
                        {item.description}
                    </p>
                </div>

                <button
                    onClick={() => {
                        if (item.url) {
                            router.visit(item.url);
                        }
                    }}
                    className="w-full btn-primary-unified text-center text-xs md:text-base !py-2 md:!py-3"
                >
                    {item.is_free ? item.button_text : "Подробнее"}
                </button>
            </div>

        </div>
    ))}
</div>

            </div>
        </section>
    );
}
