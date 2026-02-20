export default function CourseDetailsAuthor(props) {
    return (
        <section className="py-24 bg-primary/[0.02]" id="author">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1">
                    <h2 className="text-4xl font-display text-white mb-6">Давид Арутюнов</h2>
                    <p className="text-xl italic text-primary/80 mb-8">Мастер практик осознанности и философ
                        современности</p>
                    <div className="space-y-6 text-gray-400 leading-relaxed">
                        <p>Более 12 лет исследований человеческой психики и восточных практик позволили Давиду
                            создать уникальный метод синтеза древних знаний и современного коучинга.</p>
                        <p>Его подход отличается отсутствием эзотерического тумана — только работающие инструменты,
                            которые меняют качество жизни здесь и сейчас.</p>
                    </div>
                </div>
                <div className="order-1 md:order-2">
                    <div
                        className="aspect-[4/5] rounded-3xl overflow-hidden grayscale contrast-125 border border-white/10">
                        <img alt="David Arutyunov" className="w-full h-full object-cover"
                             src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNeewN5xzyQDDM-YPViJjBM7C_AksSkVWQzKnGhkmeCrc6yMUKGUpvngtuKJHPRPulCOuInKQurtbB-8dR392jAKWBegXn0fqIZTwTDPbQ7vCbzIN5pWCqj1PGDv1_pFu2AItWO2n0-5jeP8h_nwbO5BitBGJIyGiDrrl9RaRNcdSBFSPYfjfcxgPEUHBjofjW9JAoLQ1qIC8EfoRBMctjUpKAi9NqqHpWihoRg5TrZaFlWeFoJijHthXN4rZbU_j2NnUlryTXNXw"/>
                    </div>
                </div>
            </div>
        </section>


    )
}
