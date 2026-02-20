// import { Link, router, usePage } from "@inertiajs/react";
// import { useEffect, useMemo, useState } from "react";
// import Header from "@/components/Header.jsx";
// import Footer from "@/components/footer.jsx";
//
// function TwoCard({ p }) {
//     return (
//
//
//         <div className="group bg-card-dark rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all flex flex-col">
//             <div className="aspect-video relative overflow-hidden">
//                 <img
//                     alt={p.title}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                     src={p.image_url || ""}
//                     loading="lazy"
//                 />
//                 {p.badge ? (
//                     <div className="absolute top-4 left-4 bg-primary text-background-dark text-xs font-black px-3 py-1 rounded uppercase">
//                         {p.badge}
//                     </div>
//                 ) : null}
//             </div>
//
//             <div className="p-8 flex-1 flex flex-col justify-between">
//                 <div>
//                     <h4 className="text-2xl font-bold mb-3">{p.title}</h4>
//                     <p className="text-slate-400 mb-6 font-light leading-relaxed">
//                         {p.excerpt}
//                     </p>
//                 </div>
//
//                 <Link
//                     href={route("products.show", p.slug)}
//                     className="w-full btn-primary-unified text-center inline-flex items-center justify-center gap-2"
//                 >
//                     {p.button_text || "Подробнее"}
//                     <span className="material-symbols-outlined text-sm">arrow_forward</span>
//                 </Link>
//             </div>
//         </div>
//     );
// }
//
// function BigCard({ p }) {
//     return (
//         <div className="group relative bg-card-dark rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all p-1 md:p-8">
//             <div className="flex flex-col md:flex-row gap-8 items-center">
//                 <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:h-80 overflow-hidden rounded-xl">
//                     <img
//                         alt={p.title}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                         src={p.image_url || ""}
//                         loading="lazy"
//                     />
//                 </div>
//
//                 <div className="w-full md:w-1/2 p-6 md:p-0">
//                     {p.badge ? (
//                         <div className="inline-block text-primary text-xs font-black px-3 py-1 rounded border border-primary/20 mb-4 uppercase">
//                             {p.badge}
//                         </div>
//                     ) : null}
//
//                     <h4 className="text-3xl font-bold mb-4">{p.title}</h4>
//
//                     <p className="text-slate-400 mb-8 text-lg font-light italic leading-relaxed">
//                         {p.excerpt}
//                     </p>
//
//                     <Link
//                         href={route("products.show", p.slug)}
//                         className="btn-primary-unified inline-flex items-center gap-2"
//                     >
//                         {p.button_text || "Learn more"}
//                         <span className="material-symbols-outlined text-sm">arrow_forward</span>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// function renderInPattern(items) {
//     const blocks = [];
//     for (let i = 0; i < items.length; i += 3) {
//         const a = items[i];
//         const b = items[i + 1];
//         const c = items[i + 2];
//
//         if (a || b) {
//             blocks.push(
//                 <div key={`grid-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//                     {a ? <TwoCard p={a} /> : null}
//                     {b ? <TwoCard p={b} /> : null}
//                 </div>
//             );
//         }
//
//         if (c) {
//             blocks.push(
//                 <div key={`big-${i}`} className="mb-8">
//                     <BigCard p={c} />
//                 </div>
//             );
//         }
//     }
//     return blocks;
// }
//
// export default function Shop() {
//     const { products } = usePage().props;
//
//     const [items, setItems] = useState(products?.data ?? []);
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//         const incoming = products?.data ?? [];
//         const page = products?.current_page ?? 1;
//
//         if (page === 1) {
//             setItems(incoming);
//             return;
//         }
//
//         setItems((prev) => {
//             const map = new Map(prev.map((x) => [x.id, x]));
//             incoming.forEach((x) => map.set(x.id, x));
//             return Array.from(map.values());
//         });
//     }, [products?.current_page]); // eslint-disable-line react-hooks/exhaustive-deps
//
//     const hasMore = useMemo(() => Boolean(products?.next_page_url), [products]);
//
//     const loadMore = () => {
//         if (!hasMore || loading) return;
//
//         setLoading(true);
//         router.get(
//             route("shop"),
//             { page: (products.current_page ?? 1) + 1 },
//             {
//                 preserveScroll: true,
//                 preserveState: true,
//                 only: ["products"],
//                 onFinish: () => setLoading(false),
//             }
//         );
//     };
//
//     return (
//
//         <>
//             <Header />
//         <section className="py-24 bg-background-light dark:bg-background-dark" id="products">
//             <div className="max-w-7xl mx-auto px-6">
//                 <div className="flex justify-between items-end mb-16">
//                     <div className="max-w-xl">
//                         <h2 className="text-primary text-sm font-bold tracking-widest uppercase mb-4">
//                             Предложения
//                         </h2>
//                         <h3 className="text-4xl font-bold">Продукты и услуги</h3>
//                     </div>
//                 </div>
//
//                 {renderInPattern(items)}
//
//                 <div className="flex justify-center mt-10">
//                     {hasMore ? (
//                         <button
//                             onClick={loadMore}
//                             disabled={loading}
//                             className="btn-primary-unified inline-flex items-center gap-2 disabled:opacity-60"
//                         >
//                             {loading ? "Loading..." : "Load more"}
//                             <span className="material-symbols-outlined text-sm">arrow_downward</span>
//                         </button>
//                     ) : (
//                         <div className="text-slate-400 text-sm">Больше нет предложений</div>
//                     )}
//                 </div>
//             </div>
//         </section>
//             <Footer />
//         </>
//
//     );


// }
import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/footer.jsx";

function TwoCard({ p }) {
    return (
        <div className="group bg-card-dark rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all flex flex-col">
            <div className="aspect-video relative overflow-hidden">
                <img
                    alt={p?.title ?? "Product"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={p?.image_url ?? ""}
                    loading="lazy"
                />
                {p?.badge ? (
                    <div className="absolute top-4 left-4 bg-primary text-background-dark text-xs font-black px-3 py-1 rounded uppercase">
                        {p.badge}
                    </div>
                ) : null}
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                    <h4 className="text-2xl font-bold mb-3">{p?.title ?? "Untitled"}</h4>
                    <p className="text-slate-400 mb-6 font-light leading-relaxed">
                        {p?.excerpt ?? p?.hero_description ?? ""}
                    </p>
                </div>

                <Link
                    href={route("products.show", p.slug)}
                    className="w-full btn-primary-unified text-center inline-flex items-center justify-center gap-2"
                >
                    {p?.button_text || "Подробнее"}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
            </div>
        </div>
    );
}

function BigCard({ p }) {
    return (
        <div className="group relative bg-card-dark rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all p-1 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:h-80 overflow-hidden rounded-xl">
                    <img
                        alt={p?.title ?? "Product"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        src={p?.image_url ?? ""}
                        loading="lazy"
                    />
                </div>

                <div className="w-full md:w-1/2 p-6 md:p-0">
                    {p?.badge ? (
                        <div className="inline-block text-primary text-xs font-black px-3 py-1 rounded border border-primary/20 mb-4 uppercase">
                            {p.badge}
                        </div>
                    ) : null}

                    <h4 className="text-3xl font-bold mb-4">{p?.title ?? "Untitled"}</h4>

                    <p className="text-slate-400 mb-8 text-lg font-light italic leading-relaxed">
                        {p?.excerpt ?? p?.hero_description ?? ""}
                    </p>

                    <Link
                        href={route("products.show", p.slug)}
                        className="btn-primary-unified inline-flex items-center gap-2"
                    >
                        {p?.button_text || "Learn more"}
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function renderInPattern(items) {
    const blocks = [];
    for (let i = 0; i < items.length; i += 3) {
        const a = items[i];
        const b = items[i + 1];
        const c = items[i + 2];

        if (a || b) {
            blocks.push(
                <div key={`grid-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {a ? <TwoCard p={a} /> : null}
                    {b ? <TwoCard p={b} /> : null}
                </div>
            );
        }

        if (c) {
            blocks.push(
                <div key={`big-${i}`} className="mb-8">
                    <BigCard p={c} />
                </div>
            );
        }
    }
    return blocks;
}

export default function Shop() {
    const { products } = usePage().props;

    const [items, setItems] = useState(products?.data ?? []);
    const [loading, setLoading] = useState(false);

    // ✅ როცა products შეიცვლება (page/load more), განვაახლოთ items
    useEffect(() => {
        const incoming = products?.data ?? [];
        const page = products?.current_page ?? 1;

        if (page === 1) {
            setItems(incoming);
            return;
        }

        setItems((prev) => {
            const map = new Map(prev.map((x) => [x.id, x]));
            incoming.forEach((x) => map.set(x.id, x));
            return Array.from(map.values());
        });
    }, [products]);

    const hasMore = useMemo(() => Boolean(products?.next_page_url), [products]);

    const loadMore = () => {
        if (!hasMore || loading) return;

        setLoading(true);
        router.get(
            route("shop"),
            { page: (products?.current_page ?? 1) + 1 },
            {
                preserveScroll: true,
                preserveState: true,
                only: ["products"],
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <>
            <Header />

            <section className="py-24 bg-background-light dark:bg-background-dark" id="products">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-16">
                        <div className="max-w-xl">
                            <h2 className="text-primary text-sm font-bold tracking-widest uppercase mb-4">
                                Предложения
                            </h2>
                            <h3 className="text-4xl font-bold">Продукты и услуги</h3>
                        </div>
                    </div>

                    {renderInPattern(items)}

                    <div className="flex justify-center mt-10">
                        {hasMore ? (
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="btn-primary-unified inline-flex items-center gap-2 disabled:opacity-60"
                            >
                                {loading ? "Loading..." : "Load more"}
                                <span className="material-symbols-outlined text-sm">arrow_downward</span>
                            </button>
                        ) : (
                            <div className="text-slate-400 text-sm">Больше нет предложений</div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
