export default function HowTo({ personal }) {
    if (!personal) return null;

    return (
        <section className="py-24 px-6 lg:px-20 bg-surface-dark/30" id="about">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-16">

                    {/* LEFT TITLE */}
                    <div className="md:w-1/3">
                        <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                            {personal.how_title_line_1}
                            <br />
                            <span className="text-primary italic">
                                {personal.how_title_highlight}
                            </span>
                        </h2>
                        <div className="w-20 h-1 bg-primary"></div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="md:w-2/3 grid gap-10">

                        {/* DESCRIPTION */}
                        <p className="text-2xl text-white/80 font-light leading-relaxed">
                            {personal.how_description}
                        </p>

                        {/* ITEMS */}
                        <div className="grid sm:grid-cols-2 gap-8">
                            {personal.how_items?.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-8 rounded-2xl border border-white/5 bg-white/5 hover:border-primary/20 transition-all"
                                >
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {item.title}
                                    </h3>

                                    <p className="text-white/50">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
