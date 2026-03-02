export default function GroupFaq({ group }) {
    return (
        <div className="max-w-4xl mx-auto px-6">

            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-display text-white mb-4">
                    {group.faq_title}
                </h2>
            </div>

            <div className="space-y-4">
                {group.faq?.map((item, index) => (
                    <div key={index} className="border-b border-primary/20 pb-4">
                        <p className="text-xl text-white">
                            {item.question}
                        </p>
                        <p className="text-gray-400 mt-2">
                            {item.answer}
                        </p>
                    </div>
                ))}
            </div>

        </div>
    );
}
