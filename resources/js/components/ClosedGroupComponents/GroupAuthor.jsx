export default function GroupAuthor({ group }) {
    return (
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 md:order-1">
                <p className="text-primary uppercase tracking-widest text-xs font-semibold mb-3">Основатель сообщества</p>
                <h2 className="text-3xl md:text-5xl font-display text-white mb-4">{group.author_name}</h2>
                <p className="text-lg italic text-primary/80 mb-7">{group.author_subtitle}</p>
                <div className="space-y-5 text-gray-300 leading-relaxed">
                    <p>{group.author_bio_1}</p><p>{group.author_bio_2}</p>
                </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
                {group.author_image_url && (
                    <div className="relative group">
                        <div className="size-60 sm:size-72 md:size-96 lg:size-[420px] rounded-full p-1 border border-primary/20 portrait-glow transition-all duration-700 group-hover:border-primary/40 overflow-hidden">
                            <img loading="lazy" src={group.author_image_url} alt={group.author_name} className="w-full h-full object-cover rounded-full transition-all duration-1000 transform scale-105 group-hover:scale-100" />
                        </div>
                        <div className="absolute -inset-2 border border-primary/5 rounded-full -z-10 animate-[pulse_6s_ease-in-out_infinite]"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
