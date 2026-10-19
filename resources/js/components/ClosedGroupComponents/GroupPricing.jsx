export default function GroupPricing({ group }) {
    const features = (group.pricing_features || []).map(item => typeof item === "string" ? item : item?.feature).filter(Boolean);
    const checkoutUrl = group.pricing_button_url?.trim();
    return (
        <div className="max-w-2xl mx-auto rounded-3xl bg-[#1a160b] border border-primary/25 p-7 sm:p-12 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
            <div className="text-center">
                {group.pricing_badge && <span className="text-primary uppercase text-xs tracking-widest font-semibold">{group.pricing_badge}</span>}
                <h2 className="text-3xl md:text-4xl font-display text-white mt-4">{group.pricing_title}</h2>
                <div className="mt-7">
                    {group.pricing_old_price && <span className="line-through text-gray-500 text-xl mr-3">{group.pricing_old_price}</span>}
                    <div className="text-5xl md:text-6xl font-display text-primary mt-2">{group.pricing_current_price}</div>
                </div>
            </div>
            {features.length > 0 && <ul className="mt-9 pt-7 border-t border-white/10 space-y-4">
                {features.map((feature, index) => <li key={index} className="flex items-start gap-3 text-gray-200"><span className="material-symbols-outlined text-primary shrink-0" aria-hidden="true">check_circle</span><span>{feature}</span></li>)}
            </ul>}
            <a
                href={checkoutUrl || "#pricing"}
                target={checkoutUrl ? "_blank" : undefined}
                rel={checkoutUrl ? "noopener noreferrer" : undefined}
                aria-label={group.pricing_button_text || "Вступить в сообщество"}
                className="mt-9 flex w-full items-center justify-center rounded-xl bg-primary text-background-dark px-6 py-4 text-center font-bold hover:brightness-110 transition shadow-xl shadow-primary/20"
            >
                {group.pricing_button_text || "Вступить в сообщество"}
                <span className="ml-2" aria-hidden="true">→</span>
            </a>
            {group.pricing_note && <p className="text-gray-400 text-sm text-center mt-5">{group.pricing_note}</p>}
            {!checkoutUrl && <p className="text-gray-500 text-xs text-center mt-5">Для перехода к оплате укажи ссылку кнопки в админ-панели.</p>}
        </div>
    );
}
