const icons = ["groups", "auto_stories", "favorite", "forum", "self_improvement", "check_circle"];
export default function Conditions({ group }) {
    if (!group?.conditions?.length) return null;
    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.conditions.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-6 rounded-2xl border border-primary/15 bg-white/[0.04]">
                        <div className="shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">{icons[index % icons.length]}</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs uppercase tracking-wider text-primary/80 mb-1">{item.label}</p>
                            <p className="text-base font-medium text-white leading-snug">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
