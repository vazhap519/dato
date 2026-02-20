export default function CourseDetailstats(props) {
    return (
        <section className="border-y border-white/5 bg-white/[0.02]">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-center gap-6 p-4">
                        <div
                            className="h-12 w-12 rounded-full border border-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">schedule</span>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Старт</p>
                            <p className="text-xl font-display text-white">Сразу после оплаты</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 p-4 border-y md:border-y-0 md:border-x border-white/5">
                        <div
                            className="h-12 w-12 rounded-full border border-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">calendar_today</span>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Длительность</p>
                            <p className="text-xl font-display text-white">5 недель погружения</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 p-4">
                        <div
                            className="h-12 w-12 rounded-full border border-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">play_circle</span>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Формат</p>
                            <p className="text-xl font-display text-white">Записи + Практики</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
