export default function CourseDetailsFaq(props) {
    return (
        <section className="py-24 bg-background-dark" id="faq">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-display text-white mb-4">Вопросы и ответы</h2>
                    <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                </div>
                <div className="space-y-4">
                    <div className="border-b border-primary/20 pb-4">
                        <button className="w-full py-6 flex items-center justify-between text-left group">
                                <span
                                    className="text-xl font-display text-white group-hover:text-primary transition-colors">Как проходит обучение?</span>
                            <span className="material-symbols-outlined text-primary">add</span>
                        </button>
                    </div>
                    <div className="border-b border-primary/20 pb-4">
                        <button className="w-full py-6 flex items-center justify-between text-left group">
                                <span
                                    className="text-xl font-display text-white group-hover:text-primary transition-colors">Доступ и сроки</span>
                            <span className="material-symbols-outlined text-primary">add</span>
                        </button>
                    </div>
                    <div className="border-b border-primary/20 pb-4">
                        <button className="w-full py-6 flex items-center justify-between text-left group">
                                <span
                                    className="text-xl font-display text-white group-hover:text-primary transition-colors">Кому подходит курс?</span>
                            <span className="material-symbols-outlined text-primary">add</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>



    )
}
