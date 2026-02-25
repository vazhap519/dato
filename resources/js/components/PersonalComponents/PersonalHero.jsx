import Personal from "@/Pages/Personal.jsx";

export default function PersonalHero({personal}){

    return (
        <>
        <section className="relative min-h-[90vh] flex items-center overflow-hidden px-6 lg:px-20">
<div className="absolute inset-0 cinematic-glow -z-10"></div>
<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
<div className="order-2 lg:order-1 flex flex-col gap-8">
<div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full w-fit">
<span className="material-symbols-outlined text-primary text-sm">schedule</span>
<span className="text-primary text-sm font-semibold uppercase tracking-wider">{personal.hero_badge}</span>
</div>
<h1 className="text-5xl md:text-7xl font-bold leading-tight text-white">
    {personal.hero_title_line_1} <br/>
<span className="text-primary">    {personal.hero_title_highlight}</span> <br/>
    {personal.hero_title_line_2}
                    </h1>
<p className="text-xl text-white/60 max-w-lg leading-relaxed italic">
    {personal.hero_description}
                    </p>
<div className="flex flex-col sm:flex-row gap-4 mt-4">
<a href= {personal.hero_primary_button_url} className="bg-primary hover:bg-primary/90 text-background-dark px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-primary/10">
    {personal.hero_primary_button_text}
                        </a>
<a href={personal.hero_secondary_button_url} className="border border-white/10 hover:bg-white/5 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all">
    {personal.hero_secondary_button_text}
</a>
</div>
</div>
<div className="order-1 lg:order-2 relative group">
<div className="absolute inset-0 bg-primary/20 blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
<div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] bg-surface-dark">
<img   src={personal.hero_image}
       alt={personal.hero_author_name ?? "Personal image"}
     className="w-full h-full object-cover transition-all duration-700"
     data-alt={personal.hero_author_name ?? "Personal image"} />
<div className="absolute inset-0 hero-gradient"></div>
<div className="absolute bottom-8 left-8">
<p className="text-primary font-bold text-2xl">{personal.hero_author_name}</p>
<p className="text-white/50 italic">{personal.hero_author_role}</p>
</div>
</div>
</div>
</div>
</section>
        </>
    );
}
