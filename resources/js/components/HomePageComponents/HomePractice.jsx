import { router } from "@inertiajs/react";
export default function HomePractice({ practiceSection }) {
console.log(practiceSection)

    if (!practiceSection) return null;

    const {
        header_big,
        header_small,
        content = []
    } = practiceSection;

    console.log(content);
    return (
        <section className="py-24 bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="flex justify-between items-end mb-16">
                    <div className="max-w-xl">
                        <h2 className="text-primary text-sm font-bold tracking-widest uppercase mb-4">
                            {header_small ?? "Предложения"}
                        </h2>

                        <h3 className="text-4xl font-bold">
                            {header_big ?? "Продукты и услуги"}
                        </h3>
                    </div>
                </div>

                {/* PRODUCT GRID — MAP */}
           {/* PRODUCTS — 2 ITEMS DESIGN */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
    {content.slice(0, 2).map((item, index) => (
        <div
            key={index}
            className="group bg-card-dark rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all flex flex-col"
        >

            {/* IMAGE */}
            <div className="aspect-video relative overflow-hidden">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        No image
                    </div>
                )}

                {item.is_premium && (
                    <div className="absolute top-4 left-4 bg-primary text-background-dark text-xs font-black px-3 py-1 rounded uppercase">
                        Premium
                    </div>
                )}
            </div>

            {/* CONTENT */}
            <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                    <h4 className="text-2xl font-bold mb-3">
                        {item.title}
                    </h4>

                    <p className="text-slate-400 mb-6 font-light leading-relaxed">
                        {item.description}
                    </p>
                </div>

                <button
                    onClick={() => {
                        if (item.slug) {
                            router.visit(`/closed-group/${item.slug}`);
                        }
                    }}
                    className="w-full btn-primary-unified text-center"
                >
                    Подробнее
                </button>
            </div>

        </div>
    ))}
</div>

            </div>
        </section>
    );
}
