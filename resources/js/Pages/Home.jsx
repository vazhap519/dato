
// import Header from "../components/Header.jsx";
// import Footer from "@/components/footer.jsx";
// import HomeHero from "@/components/HomePageComponents/HomeHero.jsx";
// import HomeAbout from "@/components/HomePageComponents/HomeAbout.jsx";
// import HomeReviews from "@/components/HomePageComponents/HomeReviews.jsx";
// import HomeEnd from "@/components/HomePageComponents/HomeEnd.jsx";
// import HomePractice from "@/components/HomePageComponents/HomePractice.jsx";
// import { usePage,Head } from "@inertiajs/react";
// import Seo from "@/components/Seo.jsx";
// import { router } from "@inertiajs/react";

// export default function Home() {
//     const { navigation = [], hero, about, practiceSection, review ,contact  } = usePage().props;
//     const anchors = navigation.map((item) =>
//         String(item.href || "").trim().replace(/^#/, "")
//     );

//     return (
//         <>
//             <Seo  />
//             <Header />
//             <main className="pt-20">
//                 <section id={anchors[0] || "hero"} className="scroll-mt-24">
//                     <HomeHero hero={hero} />
//                 </section>

//                 <section id={anchors[1] || "products"} className="scroll-mt-24">
// <HomePractice practiceSection={practiceSection} />
//                 </section>

//                 <section id={anchors[2] || "about"} className="scroll-mt-24">
//                     <HomeAbout about={about} />
//                 </section>

//                 <section id={anchors[3] || "reviews"} className="scroll-mt-24">
//                     <HomeReviews review={review}/>
//                 </section>

//                 <section id={anchors[4] || "end"} className="scroll-mt-24">
//                     <HomeEnd contact={contact}/>
//                 </section>
//             </main>
//             <Footer />
//         </>
//     );
// }
import Header from "../components/Header.jsx";
import Footer from "@/components/footer.jsx";
import HomeHero from "@/components/HomePageComponents/HomeHero.jsx";
import HomeAbout from "@/components/HomePageComponents/HomeAbout.jsx";
import HomeReviews from "@/components/HomePageComponents/HomeReviews.jsx";
import HomeEnd from "@/components/HomePageComponents/HomeEnd.jsx";
import HomePractice from "@/components/HomePageComponents/HomePractice.jsx";
import { usePage } from "@inertiajs/react";
import Seo from "@/components/Seo.jsx";

export default function Home() {
    const {
        navigation = [],
        hero,
        about,
        practiceSection,
        review,
        contact
    } = usePage().props;

    // helper რომ არ გაიმეორო ლოგიკა
    const getId = (index, fallback) =>
        String(navigation[index]?.href || fallback)
            .trim()
            .replace(/^#/, "");

    return (
        <>
            <Seo />
            <Header />

            <main className="pt-20">

                <section id={getId(0, "hero")} className="scroll-mt-24">
                    <HomeHero hero={hero} />
                </section>

                <section id={getId(1, "products")} className="scroll-mt-24">
                    <HomePractice practiceSection={practiceSection} />
                </section>

                <section id={getId(2, "about")} className="scroll-mt-24">
                    <HomeAbout about={about} />
                </section>

                {practiceSection?.start_enabled !== false && <section id="start" className="scroll-mt-24 py-10 md:py-24 px-6">
                    <div className="max-w-5xl mx-auto rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card-dark to-background-dark px-5 py-8 md:px-16 md:py-16 text-center">
                        <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4">{practiceSection?.start_badge || "Не знаешь, с чего начать?"}</p>
                        <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-5">{practiceSection?.start_title || "Начни с трёх дней для себя."}</h2>
                        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-sm md:text-base mb-5 md:mb-8">{practiceSection?.start_description || "Бесплатный практикум «Познай себя» — возможность познакомиться с моим подходом через наблюдение, вопросы и простые задания."}</p>
                        <div className="grid grid-cols-3 gap-1.5 md:gap-4 max-w-xl mx-auto mb-5 md:mb-8">
                            {(practiceSection?.start_steps?.length ? practiceSection.start_steps.map(step => step.text) : ["Замечать", "Понимать", "Выбирать"]).map((word, i) => (
                                <div key={word} className="rounded-xl bg-white/5 border border-white/10 px-1 py-3 md:px-2 md:py-4">
                                    <span className="text-primary text-xs block mb-2">0{i + 1}</span>
                                    <span className="text-xs md:text-base font-semibold">{word}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-slate-400 text-sm mb-6">{practiceSection?.start_note || "3 дня · Бесплатно · Онлайн"}</p>
                        <a href={practiceSection?.start_button_url || "/editoria"} className="inline-flex w-full sm:w-auto items-center justify-center bg-primary text-background-dark px-8 py-4 rounded-xl font-bold hover:brightness-110 transition">{practiceSection?.start_button_text || "Перейти к практикуму"} <span className="material-symbols-outlined ml-2" aria-hidden="true">arrow_outward</span></a>
                    </div>
                </section>}

                <section id={getId(3, "reviews")} className="scroll-mt-24">
                    <HomeReviews review={review} />
                </section>

                <section id={getId(4, "end")} className="scroll-mt-24">
                    <HomeEnd contact={contact} />
                </section>

            </main>

            <Footer />
        </>
    );
}