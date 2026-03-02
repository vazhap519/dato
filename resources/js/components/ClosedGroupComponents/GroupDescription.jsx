export default function GroupDescription({ group }) {
    return (
        <div className="max-w-4xl mx-auto px-6 text-center">

            <h2 className="text-4xl md:text-5xl font-display text-white mb-10 leading-tight">
                {group.description_title}
            </h2>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xl leading-relaxed text-gray-300 font-light">
                    {group.description_content}
                </p>
            </div>

        </div>
    );
}
