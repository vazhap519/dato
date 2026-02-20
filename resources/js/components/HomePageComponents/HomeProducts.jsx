export default function HomeProducts({ shop }) {
    console.log(shop, "მაღაზია");

    return (
        <section className="py-24 bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-16">
                    <div className="max-w-xl">
                        <h2 className="text-primary text-sm font-bold tracking-widest uppercase mb-4">
                            {shop?.kicker ?? "Предложения"}
                        </h2>
                        <h3 className="text-4xl font-bold">
                            {shop?.title ?? "Продукты и услуги"}
                        </h3>
                    </div>
                </div>

                {/* აქ შენი სტატიკური ბლოკები დროებით დატოვე */}
                {/* შემდეგ ეტაპზე shop-ის items-ით ჩაანაცვლებ */}
            </div>
        </section>
    );
}

