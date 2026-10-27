import { useEffect, useState } from "react";


export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    const [isPractice, setIsPractice] = useState(false);

    useEffect(() => {
        const checkPath = () => setIsPractice(window.location.pathname.replace(/\/$/, "") === "/editoria");
        checkPath();
        window.addEventListener("popstate", checkPath);
        document.addEventListener("inertia:navigate", checkPath);
        return () => {
            window.removeEventListener("popstate", checkPath);
            document.removeEventListener("inertia:navigate", checkPath);
        };
    }, []);

    useEffect(() => {
        const update = () => setVisible(window.scrollY > 450);
        update();
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, []);

    return (
        <button
            type="button"
            aria-label="Вернуться к началу страницы"
            title="Наверх"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`fixed bottom-6 right-5 sm:bottom-8 sm:right-8 ${isPractice ? "max-sm:bottom-28" : ""} z-[90] flex h-12 w-12 items-center justify-center rounded-full border border-primary/50 bg-background-dark/95 text-primary shadow-lg shadow-black/30 backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-primary hover:text-background-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${visible ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-4 opacity-0 pointer-events-none"}`}
        >
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 15 6-6 6 6" /></svg>
        </button>
    );
}
