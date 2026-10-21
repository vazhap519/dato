import { usePage } from "@inertiajs/react";

export default function Navigation() {
    const { headerNavigation = [] } = usePage().props;

    const orderedNavigation = [...headerNavigation].sort((a, b) => {
        const rank = (item) => {
            const path = (item.href || "").split("?")[0].replace(/\/$/, "") || "/";
            const label = (item.label || "").toLowerCase();
            if (path === "/" || label.includes("главная")) return 0;
            if (label.includes("консультац") || path.includes("personal")) return 1;
            if (label.includes("сообществ") || label.includes("групп")) return 2;
            if (label.includes("услови") || label.includes("правов")) return 3;
            return 4;
        };
        return rank(a) - rank(b);
    });

    const handleClick = (event, href) => {
        const target = new URL(href, window.location.origin);
        if (target.pathname !== window.location.pathname || !target.hash) return;
        const element = document.getElementById(decodeURIComponent(target.hash.slice(1)));
        if (element) {
            event.preventDefault();
            window.history.replaceState(null, "", target.pathname + target.hash);
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <nav aria-label="Основная навигация" className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.035] px-2 py-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.12)] backdrop-blur-md">
            {orderedNavigation.map((item) => {
                const path = new URL(item.href, "https://arutyun.me").pathname.replace(/\/$/, "") || "/";
                const currentPath = typeof window !== "undefined" ? (window.location.pathname.replace(/\/$/, "") || "/") : "";
                const active = path === currentPath;
                return (
                    <a
                        key={item.id}
                        href={item.href}
                        onClick={(event) => handleClick(event, item.href)}
                        aria-current={active ? "page" : undefined}
                        className={`relative whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${active ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(250,200,60,0.2)]" : "text-white/80 hover:bg-white/[0.07] hover:text-primary"}`}
                    >
                        {item.label}
                    </a>
                );
            })}
        </nav>
    );
}
