import { usePage } from "@inertiajs/react";
import Seo from "@/components/Seo.jsx";
import Header from "@/components/Header.jsx";
import ClosedGroupHero from "@/components/ClosedGroupComponents/ClosedgroupHero.jsx";
import Conditions from "@/components/ClosedGroupComponents/Сonditions.jsx";
import PromoVideo from "@/components/ClosedGroupComponents/PromoVideo.jsx";
import GroupDescription from "@/components/ClosedGroupComponents/GroupDescription.jsx";
import GroupProgram from "@/components/ClosedGroupComponents/GroupProgram.jsx";
import GroupAuthor from "@/components/ClosedGroupComponents/GroupAuthor.jsx";
import GroupFaq from "@/components/ClosedGroupComponents/GroupFaq.jsx";
import GroupPricing from "@/components/ClosedGroupComponents/GroupPricing.jsx";
import GroupReviews from "@/components/ClosedGroupComponents/GroupReviews.jsx";
import Footer from "@/components/footer.jsx";

export default function ClosedGroup() {
    const { group, navigation = [], review } = usePage().props;

    if (!group) return null;

    const getId = (index, fallback) =>
        String(navigation[index]?.href || fallback)
            .trim()
            .replace(/^#/, "");

    return (
        <>
            <Seo />
            <Header />

            <main className="pt-20">

                <section id={getId(0, "hero")} className="relative min-h-[75vh] flex items-center overflow-hidden">
                    <ClosedGroupHero group={group} />
                </section>

                <section id={getId(1, "conditions")} className="border-y border-white/5 bg-white/[0.02]">
                    <Conditions group={group} />
                </section>

                <section id={getId(2, "promo")} className="py-24 max-w-7xl mx-auto px-6">
                    <PromoVideo group={group} />
                </section>

                <section id={getId(3, "description")} className="py-24 bg-white/[0.01]">
                    <GroupDescription group={group} />
                </section>

                <section id={getId(4, "program")} className="py-24 max-w-7xl mx-auto px-6">
                    <GroupProgram group={group} />
                </section>

                <section id={getId(5, "author")} className="py-24 bg-primary/[0.02]">
                    <GroupAuthor group={group} />
                </section>

                {review?.content?.length > 0 && <section className="py-20 bg-white/[0.02] border-y border-white/5">
                    <GroupReviews review={review} />
                </section>}

                <section id={getId(6, "faq")} className="py-24 bg-background-dark">
                    <GroupFaq group={group} />
                </section>

                <section id={getId(7, "pricing")} className="py-24 max-w-7xl mx-auto px-6 mb-24">
                    <div id={getId(7, "pricing") === "pricing" ? undefined : "pricing"} className="scroll-mt-24"><GroupPricing group={group} /></div>
                </section>

            </main>

            <Footer />
        </>
    );
}