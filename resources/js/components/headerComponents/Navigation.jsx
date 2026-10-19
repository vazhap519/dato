// import { usePage } from "@inertiajs/react";

// export default function Navigation() {
//     const { navigation = [] } = usePage().props;

//     return (
//         <nav className="hidden md:flex items-center gap-10">
//             {navigation.map((item) => {
//                 const clean = String(item.href || "").replace(/^#/, "");

//                 return (
//                     <a
//                         key={item.id}
//                         href={`/#${clean}`}
//                         className="text-sm font-medium hover:text-primary transition-colors"
//                     >
//                         {item.label}
//                     </a>
//                 );
//             })}
//         </nav>
//     );
// }
import { usePage } from "@inertiajs/react";

export default function Navigation() {
    const { navigation = [] } = usePage().props;

    const handleClick = (e, href) => {
        const id = String(href || "").trim().replace(/^#/, "");
        if (!id) {
            e.preventDefault();
            return;
        }

        // On other pages, navigate to the corresponding section on the home page.
        if (window.location.pathname !== "/") {
            return;
        }

        const el = document.getElementById(id);
        if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <nav className="hidden md:flex items-center gap-10">
            {navigation.map((item) => {
                const clean = String(item.href || "")
                    .trim()
                    .replace(/^#/, "");

                return (
                    <a
                        key={item.id}
                        href={`#${clean}`}
                        onClick={(e) => handleClick(e, item.href)}
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        {item.label}
                    </a>
                );
            })}
        </nav>
    );
}