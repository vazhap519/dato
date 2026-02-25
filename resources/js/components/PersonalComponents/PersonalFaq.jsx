import Header from "@/components/Header.jsx";
import Footer from "@/components/footer.jsx";

export default function PersonalFaq({ personal }) {

    if (!personal) return null;

    return (

        <section className="py-24 px-6 lg:px-20" id="faq">
            <div className="max-w-3xl mx-auto">

                {/* TITLE */}
                <h2 className="text-4xl font-bold text-white text-center mb-16 italic">
                    {personal.faq_title}
                </h2>

                <div className="flex flex-col gap-4">

                    {personal.faq_items?.map((item, index) => (
                        <details
                            key={index}
                            className="group border border-white/5 rounded-2xl bg-white/5 overflow-hidden open:border-primary/30 transition-all"
                        >
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <span className="text-lg font-bold text-white">
                                    {item.question}
                                </span>

                                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">
                                    expand_more
                                </span>
                            </summary>

                            <div className="px-6 pb-6 text-white/50 leading-relaxed">
                                {item.answer}
                            </div>
                        </details>
                    ))}

                </div>
            </div>
        </section>

    );
}
