import { usePage } from "@inertiajs/react";

export default function Navigation() {
    const { headerNavigation = [] } = usePage().props;

    const handleClick = (event, href) => {
        const target = new URL(href, window.location.origin);

        if (target.pathname !== window.location.pathname || !target.hash) {
            return;
        }

        const element = document.getElementById(decodeURIComponent(target.hash.slice(1)));
        if (element) {
            event.preventDefault();
            window.history.replaceState(null, "", target.pathname + target.hash);
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <nav className="hidden md:flex items-center gap-10">
            {headerNavigation.map((item) => (
                <a
                    key={item.id}
                    href={item.href}
                    onClick={(event) => handleClick(event, item.href)}
                    className="text-sm font-medium hover:text-primary transition-colors"
                >
                    {item.label}
                </a>
            ))}
        </nav>
    );
}
