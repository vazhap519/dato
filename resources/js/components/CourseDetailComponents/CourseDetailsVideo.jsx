export default function CourseDetailsVideo(props) {
    return (
        <section className="py-24 max-w-7xl mx-auto px-6">
            <div
                className="relative group cursor-pointer overflow-hidden rounded-3xl border border-white/10 aspect-video">
                <img alt="Cinematic background"
                     className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                     src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1BwoMUc8y9CPVPlp-28NRe8pFQqHi409WULR4uLax95u2QymFs6lwIUL91eP2DklVgmO-5F6S3EsmuLWjhrka8YaaQG60MaFKu7QB6PzS6Sl6L-2Pmj3Z0vsE25R5RtEbuJgtqh55ydHEdZ64BbGJtMltnNr9kCC83EiHZWik9wAUne0ldYMKBMcStiLUDCHM8w3OLB-lobS-S44858zWPjK3CFy4ZqgYbOvzZ2UbHsZRnujW3qN9I6NF8FzPthKEv5-CuezsoXw"/>
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-t from-background-dark/80 to-transparent">
                    <button
                        className="h-24 w-24 rounded-full bg-primary text-background-dark flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_50px_rgba(250,198,56,0.2)]">
                        <span className="material-symbols-outlined text-4xl fill-1">play_arrow</span>
                    </button>
                    <p className="text-2xl font-display text-white">Посмотри видео-введение</p>
                </div>
            </div>
        </section>

    )
}
