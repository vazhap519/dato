export default function GroupProgram({ group }) {
    return (
        <>
            <h2 className="text-4xl font-display text-white mb-16 text-center">
                {group.program_title}
            </h2>

            <div className="space-y-6">
                {group.program?.map((item, index) => (
                    <div key={index} className="p-8 rounded-2xl border border-white/5 bg-white/5">

                        <div className="text-primary font-display text-5xl opacity-50">
                            {String(index + 1).padStart(2, "0")}
                        </div>

                        <h3 className="text-2xl font-display text-white mb-4">
                            {item.title}
                        </h3>

                        <p className="text-gray-400 leading-relaxed">
                            {item.content}
                        </p>

                    </div>
                ))}
            </div>
        </>
    );
}
