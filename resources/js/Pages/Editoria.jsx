import { usePage } from "@inertiajs/react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import Seo from "@/components/Seo.jsx";

export default function Editoria() {
    const { editoria, navigation = [] } = usePage().props;

    const anchors = navigation.map((item) =>
        String(item.href || "").trim().replace(/^#/, "")
    );

    const getAnchor = (index, fallback) =>
        anchors[index] && anchors[index] !== ""
            ? anchors[index]
            : fallback;

    return (
        <>
            <Seo />
            <Header />

            <main className="flex-1">

                {!editoria && (
                    <div className="py-40 text-center">
                        <h2 className="text-3xl font-bold">
                            Editoria content not added yet
                        </h2>
                    </div>
                )}

                {editoria && (
                    <>
                        {/* HERO */}
                        <section
                            id={getAnchor(0, "hero")}
                            className="max-w-[1200px] mx-auto px-6 lg:px-10 py-16 lg:py-24 scroll-mt-24"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                                <div className="flex flex-col gap-8 order-2 lg:order-1">
                                    <div className="space-y-4">
                                        {editoria.hero_badge && (
                                            <span className="text-primary text-xs uppercase tracking-[0.2em]">
                                                {editoria.hero_badge}
                                            </span>
                                        )}

                                        <h1 className="text-white text-5xl lg:text-7xl italic">
                                            {editoria.hero_title}
                                        </h1>

                                        <p className="text-gray-400 text-lg max-w-lg">
                                            {editoria.hero_description}
                                        </p>
                                    </div>

                                    {editoria.hero_button_text && (
                                        <a
                                            href={editoria.hero_button_url || "#"}
                                            className="bg-primary text-background-dark px-8 py-4 rounded-lg font-bold text-lg inline-block"
                                        >
                                            {editoria.hero_button_text}
                                        </a>
                                    )}
                                </div>

                                {editoria.hero_image_url && (
                                    <div className="order-1 lg:order-2">
                                        <img
                                            src={editoria.hero_image_url}
                                            className="w-full max-w-[450px] mx-auto rounded-lg shadow-2xl"
                                        />
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* QUOTE */}
                        <section
                            id={getAnchor(1, "quote")}
                            className="bg-background-dark py-32 text-center scroll-mt-24"
                        >
                            <div className="max-w-[800px] mx-auto px-6 space-y-8">
                                <h2 className="text-white text-3xl lg:text-5xl italic">
                                    {editoria.quote_text}
                                </h2>

                                {editoria.quote_button_text && (
                                    <button className="border border-primary text-primary px-10 py-3 rounded-full">
                                        {editoria.quote_button_text}
                                    </button>
                                )}
                            </div>
                        </section>

                        {/* INFO BLOCKS */}
                        {editoria.info_blocks?.length > 0 && (
                            <section
                                id={getAnchor(2, "info")}
                                className="py-12 scroll-mt-24"
                            >
                                <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
                                    {editoria.info_blocks.map((block, i) => (
                                        <div key={i} className="text-center">
                                            <p className="text-white font-bold text-lg">
                                                {block.title}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                {block.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* PROGRAM DAYS */}
                        {editoria.program_days?.length > 0 && (
                            <section
                                id={getAnchor(3, "program")}
                                className="max-w-[1200px] mx-auto px-6 py-24 scroll-mt-24"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {editoria.program_days.map((day, i) => (
                                        <div
                                            key={i}
                                            className="p-8 border border-white/5 rounded-xl"
                                        >
                                            <span className="text-primary font-bold text-sm block mb-6">
                                                {day.day}
                                            </span>

                                            <h3 className="text-white text-2xl mb-4 italic">
                                                {day.title}
                                            </h3>

                                            <p className="text-gray-400">
                                                {day.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* FOR WHOM */}
                        <section
                            id={getAnchor(4, "for-whom")}
                            className="py-24 scroll-mt-24"
                        >
                            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                                <div>
                                    <h2 className="text-white text-4xl italic">
                                        {editoria.for_whom_title}
                                    </h2>

                                    <p className="text-gray-400 mt-4">
                                        {editoria.for_whom_description}
                                    </p>

                                    <ul className="mt-6 space-y-3">
                                        {editoria.for_whom_list?.map((item, i) => (
                                            <li key={i} className="text-gray-300">
                                                • {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {editoria.for_whom_image_url && (
                                    <img
                                        src={editoria.for_whom_image_url}
                                        className="rounded-xl shadow-2xl"
                                    />
                                )}
                            </div>
                        </section>

                        {/* AUTHOR */}
                        <section
                            id={getAnchor(5, "author")}
                            className="py-24 scroll-mt-24"
                        >
                            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                {editoria.author_image_url && (
                                    <img
                                        src={editoria.author_image_url}
                                        className="rounded-xl shadow-2xl"
                                    />
                                )}

                                <div>
                                    <h2 className="text-white text-5xl italic">
                                        {editoria.author_name}
                                    </h2>

                                    <p className="text-gray-300 mt-6 italic">
                                        {editoria.author_quote}
                                    </p>

                                    <div className="mt-6 space-y-2 text-gray-400">
                                        {editoria.author_points?.map((p, i) => (
                                            <p key={i}>• {p}</p>
                                        ))}
                                    </div>

                                    {editoria.author_button_text && (
                                        <button className="mt-6 bg-primary text-background-dark px-10 py-4 rounded-lg font-bold">
                                            {editoria.author_button_text}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* FINAL CTA */}
                        <section
                            id={getAnchor(6, "cta")}
                            className="py-24 text-center scroll-mt-24"
                        >
                            <div className="max-w-[800px] mx-auto px-6 space-y-10">
                                <h2 className="text-white text-4xl lg:text-6xl italic">
                                    {editoria.cta_title}
                                </h2>

                                <p className="text-gray-400 text-xl">
                                    {editoria.cta_description}
                                </p>

                                {editoria.cta_button_text && (
                                    <button className="bg-primary text-background-dark px-12 py-6 rounded-xl text-xl font-bold">
                                        {editoria.cta_button_text}
                                    </button>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </main>

            <Footer />
        </>
    );
}
