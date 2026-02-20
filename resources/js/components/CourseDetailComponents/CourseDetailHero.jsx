export default function CourseDetailHero(props) {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            <div className="absolute inset-0 glow-overlay"></div>
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-8">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-widest">
<span className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
</span>
                        Авторский курс Давида Арутюнова
                    </div>
                    <h1 className="text-6xl md:text-8xl font-display font-medium leading-[0.9] tracking-tighter text-white">
                        Осознание <br/><span className="italic text-primary/90">себя</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed font-light">
                        Путь к глубокой трансформации, внутренней гармонии и пониманию своих истинных желаний через
                        5 недель практики.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            className="bg-primary text-background-dark px-8 py-4 rounded-xl text-lg font-bold hover:shadow-[0_0_20px_rgba(250,198,56,0.3)] transition-all">
                            Принять участие
                        </button>
                        <button
                            className="px-8 py-4 rounded-xl text-lg font-bold border border-white/10 hover:bg-white/5 transition-all text-white">
                            Смотреть программу
                        </button>
                    </div>
                </div>
                <div className="relative flex justify-center items-center">
                    <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full"></div>
                    <div
                        className="relative w-full aspect-square max-w-[500px] rounded-2xl overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                        <img alt="Portrait of David Arutyunov" className="w-full h-full object-cover"
                             src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHzhrMf7nBjxK1sPyjTRTAccEggi6sCCQgab1i-AtE71bhX2SkmS1J-hHhI7sIr_7izVZaRrh0izTfN-v1azIkPc_r9XJdAKImZBOt_2PnEvzVIna212aOaM_kC-BOhDt4aifazwN2Bq-aAqKOnpmtqmUfPZ3cvLBSqhtZZ2jvBlWATjVbwmFcXRu0tOIpfh3SF41zcel0dFaZNN_9Ebre_TXDaArDVJJ92O1N6YJSWLIBJuw3G_6T4kNe08AqUqhcLH-NqQwlY6M"/>
                    </div>
                </div>
            </div>
        </section>
    )
}
