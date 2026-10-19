const icons = ["chat", "calendar_month", "videocam"];
export default function PersonalSteps({ personal }) {
    if (!personal) return null;
    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{personal.steps_title}</h2>
                <p className="text-white/55">{personal.steps_subtitle}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-7 lg:gap-10">
                {personal.steps_items?.map((step, index) => (
                    <div key={index} className="relative flex flex-col items-center text-center gap-4">
                        {index < personal.steps_items.length - 1 && <div className="hidden md:block absolute top-7 left-[calc(50%+42px)] w-[calc(100%-45px)] h-px bg-gradient-to-r from-primary/40 to-primary/10" aria-hidden="true" />}
                        <div className="relative z-10 w-14 h-14 rounded-full border border-primary/30 flex items-center justify-center bg-background-dark">
                            <span className="material-symbols-outlined text-primary text-2xl" aria-hidden="true">{icons[index % icons.length]}</span>
                        </div>
                        <div className="max-w-xs">
                            <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-white/55 text-sm leading-relaxed">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
