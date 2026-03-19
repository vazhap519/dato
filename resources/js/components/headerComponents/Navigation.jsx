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
//                         href={`#${clean}`}
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
        e.preventDefault();

        const id = String(href || "").replace(/^#/, "");
        const el = document.getElementById(id);

        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
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