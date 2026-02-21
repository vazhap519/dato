export default function HomeProducts({ shop }) {

    if (!shop) return null;

    return (
        <section className="py-24 bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="flex justify-between items-end mb-16">
                    <div className="max-w-xl">
                        <h2 className="text-primary text-sm font-bold tracking-widest uppercase mb-4">
                            {shop?.kicker ?? "Предложения"}
                        </h2>

                        <h3 className="text-4xl font-bold">
                            {shop?.title ?? "Продукты и услуги"}
                        </h3>
                    </div>
                </div>

                {/* PRODUCT GRID — MAP */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {shop.items?.map((item, index) => (

                        <div
                            key={index}
                            className="flex flex-col bg-slate-100/50 dark:bg-primary/5 rounded-xl overflow-hidden border border-transparent dark:border-primary/10 transition-all hover:border-primary/30 group"
                        >

                            {/* IMAGE */}
                            {item.image && (
                                <div className="aspect-square w-full overflow-hidden">
                                    <div
                                        className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105"
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    />
                                </div>
                            )}

                            {/* CONTENT */}
                            <div className="flex flex-col flex-1 p-6">

                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold dark:text-slate-100">
                                        {item.title}
                                    </h3>

                                    {item.is_premium && (
                                        <span className="text-[10px] uppercase tracking-widest bg-primary text-background-dark px-2 py-0.5 rounded font-bold">
                                            Premium
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-1">
                                    {item.description}
                                </p>

                                <div className="flex flex-col gap-4 mt-auto">

                                    <span className="text-xl font-bold text-primary italic">
                                        {item.price} ₽
                                    </span>

                                    {item.telegram_url && (
                                        <a
                                            href={item.telegram_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full h-12 flex items-center justify-center bg-primary text-background-dark font-bold rounded-lg transition-transform active:scale-95 hover:brightness-110"
                                        >
                                            Выбрать
                                        </a>
                                    )}

                                </div>
                            </div>
                        </div>

                    ))}

                </div>

            </div>
        </section>
    );
}