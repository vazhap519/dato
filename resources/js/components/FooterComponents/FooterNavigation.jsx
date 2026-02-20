export default function FooterNavigation({ navigation, footer }) {
    console.log("footer:", footer);
    console.log("navigation:", navigation);
    return (
        <div>
            <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-300">
                {footer?.nav_title}
            </h5>

            <ul className="space-y-4 text-sm text-slate-500">
                {navigation.map((item) => (
                    <li key={item.id}>
                        <a
                            href={item.href}
                            className="hover:text-primary transition-colors"
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
