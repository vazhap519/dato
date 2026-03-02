export default function GroupAuthor({ group }) {
    return (
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

            <div className="order-2 md:order-1">
                <h2 className="text-4xl font-display text-white mb-6">
                    {group.author_name}
                </h2>

                <p className="text-xl italic text-primary/80 mb-8">
                    {group.author_subtitle}
                </p>

                <div className="space-y-6 text-gray-400 leading-relaxed">
                    <p>{group.author_bio_1}</p>
                    <p>{group.author_bio_2}</p>
                </div>
            </div>

            <div className="order-1 md:order-2">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
                    {group.author_image_url && (
                        <img
                            src={group.author_image_url}
                            alt={group.author_name}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            </div>

        </div>
    );
}
