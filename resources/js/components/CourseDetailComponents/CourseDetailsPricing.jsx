export default function CourseDetailsPricing(props) {
    return (
        <section className="py-24 max-w-7xl mx-auto px-6 mb-24" id="pricing">
            <div
                className="relative rounded-3xl bg-[#1a160b] border border-white/10 p-8 md:p-16 premium-card-shadow overflow-hidden">
                <div
                    className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
                <div className="relative z-10 grid md:grid-cols-12 gap-12 items-center">
                    <div className="md:col-span-7 space-y-8">
                        <div>
<span
    className="inline-block text-[10px] font-bold tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase">
                                Инвестиция в себя
                            </span>
                            <h2 className="text-4xl md:text-5xl font-display text-white leading-tight">
                                Начните путь осознанности
                            </h2>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
                            <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">verified</span>
                                Что входит и на чём вы экономите
                            </h3>
                            <ul className="grid sm:grid-cols-1 gap-4">
                                <li className="flex items-start gap-3 group">
                                        <span
                                            className="material-symbols-outlined text-primary/60 mt-0.5">check_circle</span>
                                    <span className="text-gray-300">50+ авторских медитаций и практик</span>
                                </li>
                                <li className="flex items-start gap-3 group">
                                        <span
                                            className="material-symbols-outlined text-primary/60 mt-0.5">check_circle</span>
                                    <span className="text-gray-300">Пошаговая методология трансформации</span>
                                </li>
                                <li className="flex items-start gap-3 group">
                                        <span
                                            className="material-symbols-outlined text-primary/60 mt-0.5">check_circle</span>
                                    <span className="text-gray-300">Поддержка в закрытом сообществе</span>
                                </li>
                                <li className="flex items-start gap-3 group">
                                        <span
                                            className="material-symbols-outlined text-primary/60 mt-0.5">check_circle</span>
                                    <span
                                        className="text-gray-300 text-sm italic opacity-80 border-t border-white/5 pt-4 mt-2 w-full block">Экономия лет самостоятельного поиска и денег на консультациях</span>
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div
                                className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-gray-400 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">all_inclusive</span>
                                Доступ — Навсегда
                            </div>
                            <div
                                className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-gray-400 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">forum</span>
                                Поддержка — В чате
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-5">
                        <div className="relative flex flex-col items-center text-center space-y-8">
                            <div className="space-y-1">
                                    <span
                                        className="text-2xl font-display text-gray-500/60 line-through decoration-primary/40">50 000 ₽</span>
                                <div className="flex items-center justify-center gap-1">
                                        <span
                                            className="text-7xl md:text-8xl font-display font-medium text-primary tracking-tighter">19 900</span>
                                    <span className="text-4xl font-display text-primary mt-4">₽</span>
                                </div>
                                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase pt-2">
                                    Единоразовый платеж за полный доступ
                                </p>
                            </div>
                            <div className="w-full space-y-4">
                                <button
                                    className="w-full bg-primary text-background-dark py-5 rounded-2xl text-xl font-bold hover:shadow-[0_0_30px_rgba(250,198,56,0.25)] transition-all active:scale-95">
                                    Принять участие
                                </button>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="material-symbols-outlined text-sm">lock</span>
                                        Безопасная оплата · Гарантия возврата 7 дней
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}
