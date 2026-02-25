export default function PersonalPrice({ personal }) {

    if (!personal) return null;

    return (
        <section className="py-24 px-6 lg:px-20 bg-surface-dark/50" id="pricing">
            <div className="max-w-4xl mx-auto">
                <div className="relative p-12 md:p-16 rounded-[2.5rem] bg-background-dark border border-primary/20 shadow-2xl overflow-hidden group">

                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[80px] rounded-full"></div>

                    <div className="relative flex flex-col items-center text-center gap-8">

                        {/* TITLE */}
                        <h2 className="text-3xl font-bold text-white">
                            {personal.pricing_title}
                        </h2>

                        {/* PRICE */}
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-bold text-primary">
                                {personal.pricing_amount}
                            </span>

                            <span className="text-2xl text-white/50">
                                {personal.pricing_currency}
                            </span>
                        </div>

                        {/* FEATURES */}
                        <ul className="flex flex-col gap-4 text-white/70 max-w-md">
                            {personal.pricing_features?.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-sm">
                                        check_circle
                                    </span>
                                    {feature.feature}
                                </li>
                            ))}
                        </ul>

                        {/* BUTTON */}
                        {personal.pricing_button_text && (
                            <a
                                href={personal.pricing_button_url ?? "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-background-dark px-12 py-5 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-primary/20 mt-4 text-center"
                            >
                                {personal.pricing_button_text}
                            </a>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
}
