export default function HomeEnd() {
    return (
        <section className="py-24 bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-6">
                <div className="relative overflow-hidden bg-warm-charcoal rounded-4xl inner-soft-shadow">
                    <div className="absolute inset-0 z-0">
                        <img
                            alt="Atmospheric background"
                            className="w-full h-full object-cover opacity-10 grayscale"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNfaNzM6cMYwXYA2dOtcuilf21Kr483myKsGiNfQcvcwkwhzn0fU_pGuzcGNEMvd6Mzek3BChLvu1-IAEslvmWvNW295SkVsPsKkMFcGITSqXIHTAxvcCFytOTR6YlYHrjhbCwRC-t9DcXqMgqNYtIKwHnIB1pAy0FjEbyW6i8XoFT5cLVf_0slfCk70k-ZX-8HUSakOHWeywBOTVNPKzEm7dVgrWX86trJuaeswdJqE81VLzMJE8BntdOvR1fRORWIN8OxrcDRms"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-warm-charcoal via-warm-charcoal/80 to-transparent"></div>
                    </div>

                    <div className="relative z-10 p-12 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                                У тебя есть вопросы?
                            </h2>

                            <ul className="space-y-4">
                                <li className="flex items-center gap-4 text-xl font-light text-slate-300">
                                    <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(250,198,56,0.6)]"></span>
                                    Записать совместно подкаст?
                                </li>
                                <li className="flex items-center gap-4 text-xl font-light text-slate-300">
                                    <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(250,198,56,0.6)]"></span>
                                    Пригласить на мероприятие?
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-10 lg:pl-12">
                            <p className="text-lg lg:text-xl text-slate-400 font-light leading-relaxed">
                                Если чувствуешь отклик или хочешь обсудить формат взаимодействия — напиши.
                                Ответим спокойно и по делу.
                            </p>

                            <button className="gold-glow group flex items-center gap-4 bg-primary text-background-dark px-10 py-5 rounded-2xl text-xl font-bold transition-all hover:scale-[1.02] active:scale-95">
                                Служба заботы
                                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
