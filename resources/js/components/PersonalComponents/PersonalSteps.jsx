// export default function PersonalSteps({personal}){
// console.log(personal)
//     <section class="py-24 px-6 lg:px-20" id="steps">
// <div class="max-w-7xl mx-auto">
// <div class="text-center mb-20">
// <h2 class="text-4xl font-bold text-white mb-4">   {personal.steps_title}</h2>
// <p class="text-white/50">  {personal.steps_subtitle}</p>
// </div>
// <div class="grid md:grid-cols-3 gap-12 relative">
//
// <div class="relative flex flex-col items-center text-center gap-6">
// <div class="w-20 h-20 rounded-full border border-primary/30 flex items-center justify-center bg-background-dark z-10">
// <span class="material-symbols-outlined text-primary text-3xl">touch_app</span>
// </div>
// <div class="hidden md:block absolute top-10 left-[60%] w-full h-[1px] bg-gradient-to-r from-primary/30 to-transparent"></div>
// <div>
// <h4 class="text-xl font-bold text-white mb-2">Оставить заявку</h4>
// <p class="text-white/50">Нажмите на кнопку и заполните короткую форму обратной связи</p>
// </div>
// </div>
//
// <div class="relative flex flex-col items-center text-center gap-6">
// <div class="w-20 h-20 rounded-full border border-primary/30 flex items-center justify-center bg-background-dark z-10">
// <span class="material-symbols-outlined text-primary text-3xl">chat</span>
// </div>
// <div class="hidden md:block absolute top-10 left-[60%] w-full h-[1px] bg-gradient-to-r from-primary/30 to-transparent"></div>
// <div>
// <h4 class="text-xl font-bold text-white mb-2">Telegram контакт</h4>
// <p class="text-white/50">Мой помощник свяжется с вами для уточнения деталей и запроса</p>
// </div>
// </div>
//
// <div class="relative flex flex-col items-center text-center gap-6">
// <div class="w-20 h-20 rounded-full border border-primary/30 flex items-center justify-center bg-background-dark z-10">
// <span class="material-symbols-outlined text-primary text-3xl">event_available</span>
// </div>
// <div>
// <h4 class="text-xl font-bold text-white mb-2">Подтверждение</h4>
// <p class="text-white/50">Согласование удобного времени, оплата и начало нашего пути</p>
// </div>
// </div>
// </div>
// </div>
// </section>
//
// }
export default function PersonalSteps({ personal }) {

    if (!personal) return null;

    return (
        <section className="py-24 px-6 lg:px-20" id="steps">
            <div className="max-w-7xl mx-auto">

                {/* TITLE */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        {personal.steps_title}
                    </h2>

                    <p className="text-white/50">
                        {personal.steps_subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">

                    {personal.steps_items?.map((step, index) => (
                        <div
                            key={index}
                            className="relative flex flex-col items-center text-center gap-6"
                        >

                            {/* 🔹 ICON BLOCK — untouched as requested */}
                            <div className="w-20 h-20 rounded-full border border-primary/30 flex items-center justify-center bg-background-dark z-10">
                                <span className="material-symbols-outlined text-primary text-3xl">
                                    touch_app
                                </span>
                            </div>

                            {/* 🔹 CONTENT FROM DB */}
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">
                                    {step.title}
                                </h4>

                                <p className="text-white/50">
                                    {step.description}
                                </p>
                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}
