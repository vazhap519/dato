export default function ClosedGroupHero({ group }) {
    return (
        <>
            <div className="absolute inset-0 glow-overlay"></div>

            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">

                <div className="space-y-8">

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-widest">
                        {group.hero_badge}
                    </div>

                    <h1 className="text-6xl md:text-8xl font-display font-medium leading-[0.9] tracking-tighter text-white">
                        {group.hero_title}
                        <br />
                        <span className="italic text-primary/90">
                            {group.hero_title_highlight}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed font-light">
                        {group.hero_description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-primary text-background-dark px-8 py-4 rounded-xl text-lg font-bold">
                            {group.hero_button_primary}
                        </button>

                        <button className="px-8 py-4 rounded-xl text-lg font-bold border border-white/10 text-white">
                            {group.hero_button_secondary}
                        </button>
                    </div>
                </div>

                <div className="relative flex justify-center items-center">
                    <div className="relative w-full aspect-square max-w-[500px]">
                        {group.hero_image_url && (
                            <img
                                src={group.hero_image_url}
                                alt={group.hero_title}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}
