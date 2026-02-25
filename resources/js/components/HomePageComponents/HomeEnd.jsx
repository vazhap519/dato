import { usePage, Link } from "@inertiajs/react";

export default function HomeEnd({contact}) {


    if (!contact) return null;

    return (
        <section className="py-24 bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-6">
                <div className="relative overflow-hidden bg-warm-charcoal rounded-4xl inner-soft-shadow">

                    {/* Background Image */}
                    {contact .image && (
                        <div className="absolute inset-0 z-0">
                            <img
                                alt="Background"
                                className="w-full h-full object-cover opacity-10 grayscale"
                                src={contact .image}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-warm-charcoal via-warm-charcoal/80 to-transparent"></div>
                        </div>
                    )}

                    <div className="relative z-10 p-8 sm:p-12 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left */}
                        <div className="space-y-8">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                                {contact .title}
                            </h2>

                            <ul className="space-y-4">
                                {contact.questions?.map((q, i) => (
                                    <li key={i} className="flex items-center gap-4 text-lg sm:text-xl font-light text-slate-300">
                                        <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(250,198,56,0.6)]"></span>
                                        {typeof q === "string" ? q : q.question}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right */}
                        <div className="space-y-10 lg:pl-12">
                            <p className="text-base sm:text-lg lg:text-xl text-slate-400 font-light leading-relaxed">
                                {contact .description}
                            </p>

                            {contact .button_url && (
                                <Link
                                    href={contact .button_url}
                                    className="gold-glow group flex items-center gap-4 bg-primary text-background-dark px-8 py-4 rounded-2xl text-lg sm:text-xl font-bold transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    {contact .button_text}
                                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                                        arrow_forward
                                    </span>
                                </Link>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
