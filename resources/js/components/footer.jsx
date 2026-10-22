import { usePage } from "@inertiajs/react";

const primaryLinks = [
    { label: "Главная страница", href: "/" },
    { label: "Бесплатный практикум", href: "/editoria" },
    { label: "Закрытое сообщество", href: "/#products" },
    { label: "Личная консультация", href: "/personal" },
];

export default function Footer({ hideCta = false }) {
    const { footer, settings } = usePage().props;
    const year = new Date().getFullYear();
    const navigationLinks = Array.isArray(footer?.navigation_links) && footer.navigation_links.length ? footer.navigation_links : primaryLinks;
    const email = footer?.email?.trim();
    const location = footer?.location?.trim();

    return (
        <footer id="contacts" className="relative overflow-hidden bg-background-dark border-t border-primary/10 text-white">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(90vw,800px)] h-64 rounded-full bg-primary/[0.055] blur-[100px] pointer-events-none" aria-hidden="true" />
            <div className="relative max-w-7xl mx-auto px-6 pt-10 md:pt-20 pb-8">
                {!hideCta && footer?.cta_enabled !== false && <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.09] via-white/[0.025] to-transparent px-5 py-8 sm:px-10 md:py-14 text-center mb-9 md:mb-16">
                    <span className="text-primary text-xs font-bold uppercase tracking-[0.22em]">{footer?.cta_badge || "Пространство для себя"}</span>
                    <h2 className="text-2xl md:text-4xl font-bold mt-4 mb-4 leading-tight">{footer?.cta_title || "Иногда один шаг меняет многое."}</h2>
                    <p className="text-white/65 max-w-xl mx-auto leading-relaxed mb-5 md:mb-7 text-sm md:text-base">{footer?.cta_description || "Начни с простого знакомства с собой — на бесплатном трёхдневном практикуме."}</p>
                    <a href={footer?.cta_button_url || "/editoria"} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-background-dark font-bold hover:brightness-110 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                        {footer?.cta_button_text || "Познакомиться с практикумом"}
                        <span className="material-symbols-outlined text-xl" aria-hidden="true">arrow_outward</span>
                    </a>
                </div>}

                <div className="grid grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr] gap-x-5 md:gap-x-10 gap-y-8 md:gap-y-12 pb-9 md:pb-14">
                    <div className="max-w-sm col-span-2 lg:col-span-1">
                        <a href="/" className="inline-flex items-center gap-3 mb-5 group" aria-label="На главную страницу">
                            {settings?.logo ? (
                                <img src={settings.logo} alt={settings?.site_name || "Arutyun"} className="h-12 max-w-36 w-auto object-contain" loading="lazy" />
                            ) : (
                                <span className="text-primary text-3xl italic font-semibold">Arutyun</span>
                            )}
                            {footer?.brand_name && <span className="text-sm font-bold uppercase tracking-wide text-white group-hover:text-primary transition">{footer.brand_name}</span>}
                        </a>
                        <p className="text-white/60 text-sm leading-relaxed">{footer?.description || "Пространство для людей, которые хотят лучше понять себя и исследовать свой внутренний мир."}</p>
                    </div>

                    <nav aria-label="Навигация в подвале">
                        <h3 className="text-white font-bold text-xs uppercase tracking-[0.18em] mb-4 md:mb-6">{footer?.nav_title || "Навигация"}</h3>
                        <ul className="space-y-2.5 md:space-y-3.5">
                            {navigationLinks.map(link => (
                                <li key={link.href}><a href={link.href} className="text-white/65 text-sm hover:text-primary transition-colors">{link.label}</a></li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-label="Юридическая информация">
                        <h3 className="text-white font-bold text-xs uppercase tracking-[0.18em] mb-4 md:mb-6">{footer?.support_title || "Документы"}</h3>
                        <ul className="space-y-2.5 md:space-y-3.5">
                            <li><a href="/legal" className="text-white/65 text-sm hover:text-primary transition-colors">{footer?.support_faq || "Юридическая информация"}</a></li>
                            <li><a href="/legal#offer" className="text-white/65 text-sm hover:text-primary transition-colors">{footer?.support_offer || "Публичная оферта"}</a></li>
                            <li><a href="/legal#agreement" className="text-white/65 text-sm hover:text-primary transition-colors">{footer?.support_payment || "Условия использования"}</a></li>
                            <li><a href="/legal#privacy" className="text-white/65 text-sm hover:text-primary transition-colors">{footer?.support_privacy || "Политика конфиденциальности"}</a></li>
                        </ul>
                    </nav>

                    <div>
                        <h3 className="text-white font-bold text-xs uppercase tracking-[0.18em] mb-4 md:mb-6">{footer?.contact_title || "Контакты"}</h3>
                        <ul className="space-y-4">
                            {email && <li><a href={`mailto:${email}`} className="flex items-start gap-3 text-white/65 text-sm hover:text-primary transition-colors break-all">
                                <span className="material-symbols-outlined text-primary text-xl shrink-0" aria-hidden="true">mail</span>{email}
                            </a></li>}
                            {location && <li className="flex items-start gap-3 text-white/65 text-sm">
                                <span className="material-symbols-outlined text-primary text-xl shrink-0" aria-hidden="true">location_on</span>{location}
                            </li>}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row gap-3 justify-between items-center text-center sm:text-left text-white/40 text-xs">
                    <span>© {year} {footer?.brand_name || settings?.site_name || "Arutyun"}. Все права защищены.</span>
                    <span>{footer?.bottom_tagline || "Мир проще, чем кажется."}</span>
                </div>
            </div>
        </footer>
    );
}
