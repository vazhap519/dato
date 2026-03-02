export default function Conditions({ group }) {
    if (!group?.conditions) return null;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {group.conditions.map((item, index) => (
                    <div key={index} className="flex items-center gap-6 p-4">

                        <div className="h-12 w-12 rounded-full border border-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">
                                {index === 0 && "schedule"}
                                {index === 1 && "calendar_today"}
                                {index === 2 && "play_circle"}
                            </span>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">
                                {item.label}
                            </p>
                            <p className="text-xl font-display text-white">
                                {item.value}
                            </p>
                        </div>

                    </div>
                ))}

            </div>
        </div>
    );
}
