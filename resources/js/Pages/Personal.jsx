import { usePage } from "@inertiajs/react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/footer.jsx";
import PersonalHero from "@/components/PersonalComponents/PersonalHero.jsx";
import HowTo from "@/components/PersonalComponents/HowTo.jsx";
import PersonalSteps from "@/components/PersonalComponents/PersonalSteps.jsx";
import PersonalPrice from "@/components/PersonalComponents/PersonalPrice.jsx";
import PersonalFaq from "@/components/PersonalComponents/PersonalFaq.jsx";
import Seo from "@/components/Seo.jsx";

export default function Personal() {
    const { personal, navigation = [] } = usePage().props;
    if (!personal) return null;
    const getId = (index, fallback) => String(navigation[index]?.href || fallback).trim().replace(/^#/, "");
    const aboutId = getId(1, "about");
    const priceId = getId(3, "pricing");

    return (
        <>
            <Seo />
            <Header />
            <main className="pt-20">
                <section id={getId(0, "hero")} className="scroll-mt-24">
                    <PersonalHero personal={personal} />
                </section>

                <section id={aboutId} className="scroll-mt-24 py-16 md:py-20 bg-surface-dark/30">
                    {aboutId !== "about" && <span id="about" className="block scroll-mt-24" />}
                    <HowTo personal={personal} />
                </section>

                <section className="py-12 md:py-14 px-6">
                    <div className="max-w-5xl mx-auto rounded-2xl border border-primary/20 bg-primary/[0.04] p-7 md:p-9 flex flex-col md:flex-row gap-6 items-start">
                        <div className="shrink-0 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-3xl" aria-hidden="true">favorite</span>
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Без оценок. Без готовых рецептов.</h2>
                            <p className="text-primary mb-3">Разговор, в котором можно быть собой.</p>
                            <p className="text-white/70 leading-relaxed">Я не обещаю изменить твою жизнь за час. Но могу предложить внимание, открытый диалог и возможность посмотреть на привычные вещи с другой стороны.</p>
                        </div>
                    </div>
                </section>

                <section id={getId(2, "steps")} className="scroll-mt-24 py-16 md:py-20">
                    <PersonalSteps personal={personal} />
                </section>

                <section id={priceId} className="scroll-mt-24 py-16 md:py-20 bg-surface-dark/30">
                    {priceId !== "pricing" && <span id="pricing" className="block scroll-mt-24" />}
                    <PersonalPrice personal={personal} />
                </section>

                <section id={getId(4, "faq")} className="scroll-mt-24 py-16 md:py-20">
                    <PersonalFaq personal={personal} />
                </section>
            </main>
            <Footer />
        </>
    );
}
