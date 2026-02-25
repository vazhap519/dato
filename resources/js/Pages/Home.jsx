
import Header from "../components/Header.jsx";
import Footer from "@/components/footer.jsx";
import HomeHero from "@/components/HomePageComponents/HomeHero.jsx";
import HomeAbout from "@/components/HomePageComponents/HomeAbout.jsx";
import HomeReviews from "@/components/HomePageComponents/HomeReviews.jsx";
import HomeEnd from "@/components/HomePageComponents/HomeEnd.jsx";
import HomePractice from "@/components/HomePageComponents/HomePractice.jsx";
import { usePage,Head } from "@inertiajs/react";
import Seo from "@/components/Seo.jsx";


export default function Home() {
    const { navigation = [], hero, about, practiceSection, review ,contact  } = usePage().props;
    const anchors = navigation.map((item) =>
        String(item.href || "").trim().replace(/^#/, "")
    );

    return (
        <>
            <Seo  />
            <Header />
            <main className="pt-20">
                <section id={anchors[0] || "hero"} className="scroll-mt-24">
                    <HomeHero hero={hero} />
                </section>

                <section id={anchors[1] || "products"} className="scroll-mt-24">
<HomePractice practiceSection={practiceSection} />
                </section>

                <section id={anchors[2] || "about"} className="scroll-mt-24">
                    <HomeAbout about={about} />
                </section>

                <section id={anchors[3] || "reviews"} className="scroll-mt-24">
                    <HomeReviews review={review}/>
                </section>

                <section id={anchors[4] || "end"} className="scroll-mt-24">
                    <HomeEnd contact={contact}/>
                </section>
            </main>
            <Footer />
        </>
    );
}
