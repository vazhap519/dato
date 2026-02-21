// import
//     Header from '../components/Header.jsx';
// import Footer from "@/components/footer.jsx";
// import HomeHero from "@/components/HomePageComponents/HomeHero.jsx";
// import HomeProducts from "@/components/HomePageComponents/HomeProducts.jsx";
// import HomeAbout from "@/components/HomePageComponents/HomeAbout.jsx";
// import HomeReviews from "@/components/HomePageComponents/HomeReviews.jsx";
// import HomeEnd from "@/components/HomePageComponents/HomeEnd.jsx";
// import {usePage} from "@inertiajs/react";
// import {useState} from "react";
//
// export default function Home() {
//     const Home = usePage().props;
// const hero = Home.hero;
//
//     return (
//         <>
//             <Header/>
//             <main className="pt-20">
//                 <HomeHero hero={hero} />
// <HomeProducts />
//                 <HomeAbout />
//                 <HomeReviews />
//          <HomeEnd />
//             </main>
//             <Footer/>
//         </>
//     );
// }
// import Header from "../components/Header.jsx";
// import Footer from "@/components/footer.jsx";
// import HomeHero from "@/components/HomePageComponents/HomeHero.jsx";
// import HomeProducts from "@/components/HomePageComponents/HomeProducts.jsx";
// import HomeAbout from "@/components/HomePageComponents/HomeAbout.jsx";
// import HomeReviews from "@/components/HomePageComponents/HomeReviews.jsx";
// import HomeEnd from "@/components/HomePageComponents/HomeEnd.jsx";
// import { usePage } from "@inertiajs/react";
//
// export default function Home() {
//     const { navigation = [], hero } = usePage().props;
//
//     // Anchors come from DB (navigation_items.href). Order matters (sort)
//     const anchors = navigation.map((item) =>
//         String(item.href || "").trim().replace(/^#/, "")
//     );
//
//     return (
//         <>
//             <Header />
//             <main className="pt-20">
//                 <section id={anchors[0] || "hero"} className="scroll-mt-24">
//                     <HomeHero hero={hero} />
//                 </section>
//
//                 <section id={anchors[1] || "products"} className="scroll-mt-24">
//                     <HomeProducts />
//                 </section>
//
//                 <section id={anchors[2] || "about"} className="scroll-mt-24">
//                     <HomeAbout />
//                 </section>
//
//                 <section id={anchors[3] || "reviews"} className="scroll-mt-24">
//                     <HomeReviews />
//                 </section>
//
//                 <section id={anchors[4] || "end"} className="scroll-mt-24">
//                     <HomeEnd />
//                 </section>
//             </main>
//             <Footer />
//         </>
//     );
// }
import Header from "../components/Header.jsx";
import Footer from "@/components/footer.jsx";
import HomeHero from "@/components/HomePageComponents/HomeHero.jsx";
import HomeProducts from "@/components/HomePageComponents/HomeProducts.jsx";
import HomeAbout from "@/components/HomePageComponents/HomeAbout.jsx";
import HomeReviews from "@/components/HomePageComponents/HomeReviews.jsx";
import HomeEnd from "@/components/HomePageComponents/HomeEnd.jsx";
import { usePage } from "@inertiajs/react";

export default function Home() {
    const { navigation = [], hero, about, practiceSection  } = usePage().props;
console.log(practiceSection)
    const anchors = navigation.map((item) =>
        String(item.href || "").trim().replace(/^#/, "")
    );

    return (
        <>
            <Header />
            <main className="pt-20">
                <section id={anchors[0] || "hero"} className="scroll-mt-24">
                    <HomeHero hero={hero} />
                </section>

                <section id={anchors[1] || "products"} className="scroll-mt-24">
<HomeProducts practiceSection={practiceSection} />
                </section>

                <section id={anchors[2] || "about"} className="scroll-mt-24">
                    <HomeAbout about={about} />
                </section>

                <section id={anchors[3] || "reviews"} className="scroll-mt-24">
                    <HomeReviews />
                </section>

                <section id={anchors[4] || "end"} className="scroll-mt-24">
                    <HomeEnd />
                </section>
            </main>
            <Footer />
        </>
    );
}
