import { usePage } from "@inertiajs/react";

export default function Navigation() {
    const { navigation = [] } = usePage().props;

    return (
        <nav className="hidden md:flex items-center gap-10">
            {navigation.map((item) => {
                const clean = String(item.href || "").replace(/^#/, "");

                return (
                    <a
                        key={item.id}
                        href={`#${clean}`}
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        {item.label}
                    </a>
                );
            })}
        </nav>
    );
}
