export default function PersonalPrice({ personal }) {
    if (!personal) return null;
    const url = personal.pricing_button_url?.trim();
    const currency = personal.pricing_currency || "€";
    return (
        <div className="max-w-2xl mx-auto px-6">
            <div className="relative p-7 sm:p-10 md:p-12 rounded-3xl bg-background-dark border border-primary/25 shadow-2xl overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
                <div className="relative flex flex-col items-center text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{personal.pricing_title}</h2>
                    <div className="flex items-baseline justify-center gap-2 mt-5">
                        <span className="text-5xl md:text-6xl font-bold text-primary">{personal.pricing_amount}</span>
                        <span className="text-4xl md:text-5xl font-bold text-primary">{currency}</span>
                    </div>
                    <p className="text-white/60 text-sm mt-2">60 минут · Онлайн · Один на один</p>
                    {personal.pricing_features?.length > 0 && <ul className="w-full max-w-md flex flex-col gap-3 text-left text-white/75 mt-8 pt-7 border-t border-white/10">
                        {personal.pricing_features.map((feature, index) => <li key={index} className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-primary text-lg shrink-0" aria-hidden="true">check_circle</span>
                            <span>{typeof feature === "string" ? feature : feature.feature}</span>
                        </li>)}
                    </ul>}
                    {personal.pricing_button_text && <a href={url || "#pricing"} target={url && !url.startsWith("#") ? "_blank" : undefined} rel={url && !url.startsWith("#") ? "noopener noreferrer" : undefined} className="w-full max-w-md inline-flex justify-center items-center bg-primary hover:bg-primary/90 text-background-dark px-7 py-4 rounded-xl font-bold text-lg transition shadow-xl shadow-primary/20 mt-8">
                        {personal.pricing_button_text}<span className="ml-2" aria-hidden="true">→</span>
                    </a>}
                    <p className="text-white/45 text-sm mt-4">Время встречи согласовывается индивидуально</p>
                </div>
            </div>
        </div>
    );
}
