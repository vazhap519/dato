export default function CourseDetailsProgram(props) {
    return (
        <section className="py-24 max-w-7xl mx-auto px-6" id="program">
            <h2 className="text-4xl font-display text-white mb-16 text-center">Программа трансформации</h2>
            <div className="space-y-6">
                <div
                    className="group p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/[0.08] transition-all flex flex-col md:flex-row gap-8 items-start">
                    <div className="text-primary font-display text-5xl opacity-50">01</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-display text-white mb-4">Освобождение от шума</h3>
                        <p className="text-gray-400 leading-relaxed">Работа с информационным пространством,
                            медитативные техники детокса и выявление первых ограничивающих убеждений.</p>
                    </div>
                    <div className="text-gray-600 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-3xl">expand_more</span>
                    </div>
                </div>
                <div
                    className="group p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/[0.08] transition-all flex flex-col md:flex-row gap-8 items-start">
                    <div className="text-primary font-display text-5xl opacity-50">02</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-display text-white mb-4">Контакт с телом</h3>
                        <p className="text-gray-400 leading-relaxed">Понимание телесных откликов, работа с зажимами
                            и использование тела как навигатора в принятии решений.</p>
                    </div>
                    <div className="text-gray-600 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-3xl">expand_more</span>
                    </div>
                </div>
                <div
                    className="group p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/[0.08] transition-all flex flex-col md:flex-row gap-8 items-start">
                    <div className="text-primary font-display text-5xl opacity-50">03</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-display text-white mb-4">Ядро личности</h3>
                        <p className="text-gray-400 leading-relaxed">Определение ценностей, миссии и того, что дает
                            вам энергию. Глубинное интервью с самим собой.</p>
                    </div>
                    <div className="text-gray-600 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-3xl">expand_more</span>
                    </div>
                </div>
            </div>
        </section>

    )
}
