// import { usePage } from "@inertiajs/react";
// import Header from "@/components/Header.jsx";
// import Footer from "@/components/footer.jsx";
// import PersonalHero from "../components/PersonalComponents/PersonalHero";
// import HowTo from "../components/PersonalComponents/HowTo";
// import PersonalSteps from "../components/PersonalComponents/PersonalSteps";
// import PersonalPrice from "../components/PersonalComponents/PersonalPrice";
// import PersonalFaq from "../components/PersonalComponents/PersonalFaq";
// import Seo from "@/components/Seo.jsx";

// export default function Personal() {
//     const { personal, navigation = [] } = usePage().props;

//     if (!personal) return null;

//     const anchors = navigation.map((item) =>
//         String(item.href || "").trim().replace(/^#/, "")
//     );

//     return (
//         <>
//             <Seo />
//             <Header />

//             <main className="pt-20">

//                 <section id={anchors[0] || "hero"} className="scroll-mt-24">
//                     <PersonalHero personal={personal} />
//                 </section>

//                 <section id={anchors[1] || "about"} className="scroll-mt-24">
//                     <HowTo personal={personal} />
//                 </section>

//                 <section id={anchors[2] || "steps"} className="scroll-mt-24">
//                     <PersonalSteps personal={personal} />
//                 </section>

//                 <section id={anchors[3] || "pricing"} className="scroll-mt-24">
//                     <PersonalPrice personal={personal} />
//                 </section>

//                 <section id={anchors[4] || "faq"} className="scroll-mt-24">
//                     <PersonalFaq personal={personal} />
//                 </section>

//             </main>

//             <Footer />
//         </>
//     );
// }
import { usePage } from "@inertiajs/react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/footer.jsx";
import PersonalHero from "../components/PersonalComponents/PersonalHero";
import HowTo from "../components/PersonalComponents/HowTo";
import PersonalSteps from "../components/PersonalComponents/PersonalSteps";
import PersonalPrice from "../components/PersonalComponents/PersonalPrice";
import PersonalFaq from "../components/PersonalComponents/PersonalFaq";
import Seo from "@/components/Seo.jsx";

export default function Personal() {
    const { personal, navigation = [] } = usePage().props;

    if (!personal) return null;

    // ✅ unified helper
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
                    <PersonalHero personal={personal} />
                </section>

                <section id={getId(1, "about")} className="scroll-mt-24">
                    <HowTo personal={personal} />
                </section>

                <section id={getId(2, "steps")} className="scroll-mt-24">
                    <PersonalSteps personal={personal} />
                </section>

                <section id={getId(3, "pricing")} className="scroll-mt-24">
                    <PersonalPrice personal={personal} />
                </section>

                <section id={getId(4, "faq")} className="scroll-mt-24">
                    <PersonalFaq personal={personal} />
                </section>

            </main>

            <Footer />
        </>
    );
}