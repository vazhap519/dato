import { usePage } from "@inertiajs/react";
// import Seo from "@/components/Seo";
import Header from "@/components/Header.jsx";
import ClosedGroupHero from "@/components/ClosedGroupComponents/ClosedgroupHero.jsx";
import Conditions from "@/components/ClosedGroupComponents/Сonditions.jsx";
import PromoVideo from "@/components/ClosedGroupComponents/PromoVideo.jsx";
import GroupDescription from "@/components/ClosedGroupComponents/GroupDescription.jsx";
import GroupProgram from "@/components/ClosedGroupComponents/GroupProgram.jsx";
import GroupAuthor from "@/components/ClosedGroupComponents/GroupAuthor.jsx";
import GroupFaq from "@/components/ClosedGroupComponents/GroupFaq.jsx";
import GroupPricing from "@/components/ClosedGroupComponents/GroupPricing.jsx";
import Footer from "@/components/footer.jsx";

export default function ClosedGroup() {

    const { group, navigation = [] } = usePage().props;
    const anchors = navigation.map((item) =>
        String(item?.href || "")
            .trim()
            .replace(/^#/, "")
    );
    if (!group) return null;

    return (
        <>
            {/*<Seo/>*/}
            <Header/>

            <main className="pt-20">

                <section id={navigation[0] || "hero"} className="relative min-h-[90vh] flex items-center overflow-hidden">
                    <ClosedGroupHero group={group} />
                </section>

                <section id={navigation[1] || "conditions"} className="border-y border-white/5 bg-white/[0.02]">
                    <Conditions group={group}/>
                </section>

                <section id={navigation[2] || "promo"} className="py-24 max-w-7xl mx-auto px-6">
                    <PromoVideo group={group}/>
                </section>

                <section id={navigation[3] || "description"} className="py-24 bg-white/[0.01]">
                    <GroupDescription group={group}/>
                </section>

                <section id={navigation[4] || "program"} className="py-24 max-w-7xl mx-auto px-6">
                    <GroupProgram group={group}/>
                </section>

                <section id={navigation[5] || "author"} className="py-24 bg-primary/[0.02]">
                    <GroupAuthor group={group}/>
                </section>

                <section id={navigation[6] || "faq"} className="py-24 bg-background-dark">
                    <GroupFaq group={group}/>
                </section>

                <section id={navigation[7] || "pricing"} className="py-24 max-w-7xl mx-auto px-6 mb-24">
                    <GroupPricing group={group}/>
                </section>

            </main>
            <Footer/>
        </>
    );
}
