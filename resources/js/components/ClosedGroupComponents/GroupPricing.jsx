export default function GroupPricing({ group }) {
    return (
        <div className="rounded-3xl bg-[#1a160b] border border-white/10 p-12 text-center">

            <span className="text-primary uppercase text-xs tracking-widest">
                {group.pricing_badge}
            </span>

            <h2 className="text-4xl font-display text-white mt-4">
                {group.pricing_title}
            </h2>

            <div className="mt-8">
                <span className="line-through text-gray-500 text-2xl">
                    {group.pricing_old_price}
                </span>

                <div className="text-6xl text-primary mt-4">
                    {group.pricing_current_price}
                </div>

                <p className="text-gray-400 mt-4">
                    {group.pricing_note}
                </p>
            </div>

        </div>
    );
}
