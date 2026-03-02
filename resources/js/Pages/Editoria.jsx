import { usePage } from "@inertiajs/react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import Seo from "@/components/Seo.jsx";

export default function Editoria() {

    const { editoria, navigation = [] } = usePage().props;

    const anchors = navigation.map((item) =>
        String(item?.href || "").trim().replace(/^#/, "")
    );

    if (!editoria) {
        return (
            <>
                <Seo />
                <Header />
                <div className="py-40 text-center text-white">
                    Editoria content not added yet
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Seo />
            <Header />

            <main className="pt-20">

                {/* HERO */}
                <section id={anchors[0] || "hero"} className="scroll-mt-24 max-w-[1200px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
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
                                    className="group flex items-center gap-4 bg-primary text-background-dark px-8 py-4 rounded-lg font-bold text-lg transition hover:scale-[1.02]"
                                >
                                    {editoria.hero_button_text}
                                </a>
                            )}
                        </div>

                        {editoria.hero_image_url && (
                            <img
                                src={editoria.hero_image_url}
                                className="w-full max-w-[450px] mx-auto rounded-lg shadow-2xl order-1 lg:order-2"
                                alt="Hero"
                            />
                        )}
                    </div>
                </section>

                {/* QUOTE */}
                {editoria.quote_text && (
                    <section id={anchors[1] || "quote"} className="scroll-mt-24 bg-background-dark py-32 border-y border-primary/10">
                        <div className="max-w-[800px] mx-auto px-6 text-center space-y-8">
                            <h2 className="text-white text-3xl lg:text-5xl italic">
                                {editoria.quote_text}
                            </h2>

                            {editoria.quote_button_text && (
                                <button className="bg-primary/10 border border-primary text-primary px-10 py-3 rounded-full hover:bg-primary hover:text-background-dark transition">
                                    {editoria.quote_button_text}
                                </button>
                            )}
                        </div>
                    </section>
                )}

                {/* INFO BLOCKS */}
                {Array.isArray(editoria.info_blocks) && (
                    <section id={anchors[2] || "info"} className="scroll-mt-24 bg-graphite/50 border-b border-primary/10">
                        <div className="max-w-[1200px] mx-auto px-6 py-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                                {editoria.info_blocks.map((block, i) => (
                                    <div key={i}>
                                        <p className="text-white font-bold text-lg">
                                            {block.title}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {block.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* PROGRAM */}
                {Array.isArray(editoria.program_days) && (
                    <section id={anchors[3] || "program"} className="scroll-mt-24 max-w-[1200px] mx-auto px-6 py-24">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {editoria.program_days.map((day, i) => (
                                <div key={i} className="p-8 border border-white/5 bg-white/5 rounded-xl">
                                    <span className="text-primary font-bold text-sm block mb-6">
                                        {day.day_label}
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

                        {editoria.program_button_text && (
                            <div className="mt-16 text-center">
                                <button className="bg-primary text-background-dark px-12 py-4 rounded-lg font-bold text-lg hover:bg-white transition">
                                    {editoria.program_button_text}
                                </button>
                            </div>
                        )}
                    </section>
                )}

                {/* FOR WHOM */}
                <section id={anchors[4] || "for-whom"} className="scroll-mt-24 bg-graphite py-24 border-y border-white/5">
                    <div className="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">

                        <div>
                            <h2 className="text-white text-4xl italic">
                                {editoria.for_whom_title}
                            </h2>

                            <p className="text-gray-400 mt-4">
                                {editoria.for_whom_description}
                            </p>

                            <ul className="space-y-4 mt-6">
                                {editoria.for_whom_list?.map((item, i) => (
                                    <li key={i} className="text-gray-300">
                                        • {item}
                                    </li>
                                ))}
                            </ul>

                            {editoria.for_whom_button_text && (
                                <button className="mt-6 text-primary border-b border-primary py-1 font-bold text-lg hover:text-white hover:border-white transition">
                                    {editoria.for_whom_button_text}
                                </button>
                            )}
                        </div>

                        {editoria.for_whom_image_url && (
                            <img
                                src={editoria.for_whom_image_url}
                                className="rounded-xl shadow-2xl"
                                alt="For whom"
                            />
                        )}
                    </div>
                </section>

                {/* WHY */}
                {editoria.why_title && (
                    <section id={anchors[5] || "why"} className="scroll-mt-24 max-w-[800px] mx-auto px-6 py-32 text-center">
                        <h2 className="text-white text-3xl italic">
                            {editoria.why_title}
                        </h2>

                        <p className="text-gray-400 text-xl mt-6">
                            {editoria.why_description}
                        </p>

                        {editoria.why_button_text && (
                            <button className="text-primary border-b border-primary py-1 font-bold text-lg hover:text-white hover:border-white transition-all">
                                {editoria.why_button_text}
                            </button>
                        )}
                    </section>
                )}

                {/* AUTHOR */}
                <section id={anchors[6] || "author"} className="scroll-mt-24 max-w-[1200px] mx-auto px-6 py-24 border-t border-white/5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {editoria.author_image_url && (
                            <img
                                src={editoria.author_image_url}
                                className="w-full h-[600px] object-cover rounded-xl shadow-2xl"
                                alt="Author"
                            />
                        )}

                        <div>
                            <h2 className="text-white text-5xl italic">
                                {editoria.author_name}
                            </h2>

                            <p className="text-gray-300 mt-6 italic">
                                {editoria.author_quote}
                            </p>

                            {editoria.author_points?.map((p, i) => (
                                <p key={i} className="text-gray-400 mt-2">
                                    • {p}
                                </p>
                            ))}

                            {editoria.author_button_text && (
                                <button className="mt-6 bg-primary text-background-dark px-10 py-4 rounded-lg font-bold">
                                    {editoria.author_button_text}
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* FINAL CTA */}
                {editoria.cta_title && (
                    <section id={anchors[7] || "final"} className="scroll-mt-24 max-w-[1200px] mx-auto px-6 py-24">
                        <div className="bg-gradient-to-br from-graphite to-background-dark border border-primary/30 rounded-3xl p-12 lg:p-24 text-center space-y-8">
                            <h2 className="text-white text-4xl lg:text-6xl italic">
                                {editoria.cta_title}
                            </h2>

                            <p className="text-gray-400 text-xl">
                                {editoria.cta_description}
                            </p>

                            {editoria.cta_button_text && (
                                <button className="bg-primary text-background-dark text-xl font-bold py-6 px-12 rounded-xl">
                                    {editoria.cta_button_text}
                                </button>
                            )}
                        </div>
                    </section>
                )}

            </main>

            <Footer />
        </>
    );
}
