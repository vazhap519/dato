import { usePage } from "@inertiajs/react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/footer.jsx";
import Seo from "@/components/Seo.jsx";

export default function Legal() {

    const { legal, navigation = [] } = usePage().props;

    const anchors = navigation.map((item) =>
        String(item.href || "")
            .trim()
            .replace(/^#/, "")
    );

    const getAnchor = (index, fallback) =>
        anchors[index] && anchors[index] !== ""
            ? anchors[index]
            : fallback;

    return (
        <>
            <Seo />
            <Header />

            <main className="relative min-h-screen sacred-pattern py-12 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">

                    {/* თუ legal საერთოდ არ არსებობს */}
                    {!legal && (
                        <div className="py-40 text-center">
                            <h2 className="text-3xl font-bold mb-4">
                                Legal content not added yet
                            </h2>
                            <p className="text-muted-text">
                                Please add content from admin panel.
                            </p>
                        </div>
                    )}

                    {legal && (
                        <>
                            {/* HEADER */}
                            <div className="mb-16 max-w-2xl">
                                <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                                    {legal.title}
                                </h1>

                                {legal.subtitle && (
                                    <p className="text-xl text-muted-text dark:text-gray-400 leading-relaxed">
                                        {legal.subtitle}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col lg:flex-row gap-12">

                                {/* SIDEBAR */}
                                <aside className="w-full lg:w-72">
                                    <div className="sticky top-32 flex flex-col gap-2">
                                        {navigation.map((item) => (
                                            <a
                                                key={item.id}
                                                href={`#${item.href}`}
                                                className="px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-all"
                                            >
                                                {item.label}
                                            </a>
                                        ))}
                                    </div>
                                </aside>

                                {/* CONTENT */}
                                <div className="flex-1 space-y-16">

                                    {/* SECTION 1 */}
                                    <section
                                        id={getAnchor(0, "privacy")}
                                        className="scroll-mt-24"
                                    >
                                        {legal.privacy_title && (
                                            <h2 className="text-3xl font-bold mb-6">
                                                {legal.privacy_title}
                                            </h2>
                                        )}

                                        {legal.privacy_content && (
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: legal.privacy_content,
                                                }}
                                            />
                                        )}
                                    </section>

                                    {/* SECTION 2 */}
                                    <section
                                        id={getAnchor(1, "agreement")}
                                        className="scroll-mt-24"
                                    >
                                        {legal.agreement_title && (
                                            <h2 className="text-3xl font-bold mb-6">
                                                {legal.agreement_title}
                                            </h2>
                                        )}

                                        {legal.agreement_content && (
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: legal.agreement_content,
                                                }}
                                            />
                                        )}
                                    </section>

                                    {/* SECTION 3 */}
                                    <section
                                        id={getAnchor(2, "offer")}
                                        className="scroll-mt-24"
                                    >
                                        {legal.offer_title && (
                                            <h2 className="text-3xl font-bold mb-6">
                                                {legal.offer_title}
                                            </h2>
                                        )}

                                        {legal.offer_content && (
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: legal.offer_content,
                                                }}
                                            />
                                        )}
                                    </section>

                                    {/* SECTION 4 */}
                                    <section
                                        id={getAnchor(3, "details")}
                                        className="scroll-mt-24"
                                    >
                                        {legal.details_title && (
                                            <h2 className="text-3xl font-bold mb-6">
                                                {legal.details_title}
                                            </h2>
                                        )}

                                        {legal.company_details?.length > 0 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {legal.company_details.map((item, index) => (
                                                    <div key={index}>
                                                        <p className="text-xs uppercase tracking-widest mb-1">
                                                            {item.label}
                                                        </p>
                                                        <p className="text-lg font-bold">
                                                            {item.value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </section>

                                </div>
                            </div>
                        </>
                    )}

                </div>
            </main>

            <Footer />
        </>
    );
}
