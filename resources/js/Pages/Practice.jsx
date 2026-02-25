import { usePage } from "@inertiajs/react";
import { useState } from "react";
import Seo from "@/components/Seo.jsx";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";

export default function Practice() {
    const { practiceSection, navigation = [] } = usePage().props;

    const items = practiceSection?.content ?? [];

    const anchors = navigation.map((item) =>
        String(item.href || "")
            .trim()
            .replace(/^#/, "")
    );

    const getAnchor = (index, fallback) =>
        anchors[index] && anchors[index] !== ""
            ? anchors[index]
            : fallback;

    // რამდენი item ჩანს
    const [visibleCount, setVisibleCount] = useState(3);

    const loadMore = () => {
        setVisibleCount((prev) => prev + 3);
    };

    return (
        <>
            <Seo />
            <Header />

            <main className="flex flex-1 flex-col items-center py-12 lg:py-20 px-6">

                {!practiceSection ? (
                    <div className="text-center py-40">
                        <h2 className="text-3xl font-bold mb-4">
                            Контент пока не добавлен
                        </h2>
                        <p className="text-muted-text">
                            Раздел находится в разработке.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* HERO SECTION */}
                        <section
                            id={getAnchor(0, "practice-hero")}
                            className="max-w-[960px] w-full mb-16 text-left scroll-mt-24"
                        >
                            <h1 className="text-4xl lg:text-6xl font-bold mb-4 tracking-tight dark:text-slate-100">
                                {practiceSection.header_big}
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-600 dark:text-primary/70 max-w-2xl">
                                {practiceSection.header_small}
                            </p>
                        </section>

                        {/* GRID SECTION */}
                        <section
                            id={getAnchor(1, "practice-list")}
                            className="w-full flex flex-col items-center scroll-mt-24"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px] w-full">

                                {items.slice(0, visibleCount).map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col bg-slate-100/50 dark:bg-primary/5 rounded-xl overflow-hidden border border-transparent dark:border-primary/10 transition-all hover:border-primary/30 group"
                                    >
                                        {/* IMAGE */}
                                        {item.image ? (
                                            <div className="aspect-square w-full overflow-hidden">
                                                <div
                                                    className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105"
                                                    style={{
                                                        backgroundImage: `url(${item.image})`,
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-square w-full bg-gray-200 flex items-center justify-center">
                                                No image
                                            </div>
                                        )}

                                        {/* CONTENT */}
                                        <div className="flex flex-col flex-1 p-6">
                                            <h3 className="text-xl font-bold mb-2 dark:text-slate-100">
                                                {item.title}
                                            </h3>

                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-1">
                                                {item.description}
                                            </p>

                                            <div className="flex flex-col gap-4 mt-auto">
                                                {item.price && (
                                                    <span className="text-xl font-bold text-primary italic">
                                                        {item.price} ₽
                                                    </span>
                                                )}

                                                {item.telegram_url && (
                                                    <a
                                                        href={item.telegram_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full h-12 flex items-center justify-center bg-primary text-background-dark font-bold rounded-lg transition-transform active:scale-95 hover:brightness-110"
                                                    >
                                                        Подробнее
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* LOAD MORE BUTTON */}
                            {visibleCount < items.length && (
                                <div className="mt-12">
                                    <button
                                        onClick={loadMore}
                                        className="px-8 py-3 bg-primary text-background-dark font-bold rounded-lg transition hover:brightness-110 active:scale-95"
                                    >
                                        Загрузить больше
                                    </button>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>

            <Footer />
        </>
    );
}
