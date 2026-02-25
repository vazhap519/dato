import { usePage } from "@inertiajs/react";
import { Swiper, SwiperSlide } from "swiper/react";
import {Autoplay } from "swiper/modules";

import "swiper/css";
export default function HomeReviews({review}) {


    if (!review) return null;

    return (
        <section className="py-24 bg-card-dark/30" id="reviews">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER — მხოლოდ ერთხელ */}
              <div className="text-center mb-12 sm:mb-16 px-4">
    <h2 className="text-primary text-xs sm:text-sm font-bold tracking-widest uppercase mb-4">
        {review.review_sm_header}
    </h2>

    <h3 className="
        text-2xl
        sm:text-3xl
        md:text-4xl
        lg:text-5xl
        font-bold
        leading-tight
        break-words
        max-w-3xl
        mx-auto
    ">
        {review.review_xl_header}
    </h3>
</div>


                {/* GRID — map */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {review.content?.map((item, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-2xl bg-card-dark border border-white/5 space-y-6 flex flex-col justify-between"
                        >
                            <div className="text-primary">
                                <span className="material-symbols-outlined fill-1">
                                    format_quote
                                </span>
                            </div>

                            <p className="text-slate-300 italic font-light leading-relaxed">
                                "{item.description}"
                            </p>

                            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                <div className="size-12 rounded-full bg-slate-700 overflow-hidden">
                                    {item.u_image && (
                                        <img
                                            src={item.u_image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>

                                <div>
                                    <h5 className="font-bold">
                                        {item.name} {item.lastname}
                                    </h5>
                                    <p className="text-xs text-slate-500 uppercase">
                                        {item.position}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> */}
{/* CAROUSEL */}
<Swiper
    modules={[Autoplay]}
    spaceBetween={24}
    slidesPerView={1}
    autoplay={{ delay: 2000 }}
    breakpoints={{
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
    }}
>
    {review.content?.map((item, index) => (
        <SwiperSlide key={index}>
            <div className="h-full p-8 rounded-2xl bg-card-dark border border-white/5 space-y-6 flex flex-col justify-between">
                <div className="text-primary">
                    <span className="material-symbols-outlined fill-1">
                        format_quote
                    </span>
                </div>

                <p className="text-slate-300 italic font-light leading-relaxed">
                    "{item.description}"
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                    <div className="size-12 rounded-full bg-slate-700 overflow-hidden">
                        {item.u_image && (
                            <img   loading="eager"
                                   fetchpriority="high"
                                   decoding="async"
                                src={`/storage/${item.u_image}`}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    <div>
                        <h5 className="font-bold">
                            {item.name} {item.lastname}
                        </h5>
                        <p className="text-xs text-slate-500 uppercase">
                            {item.position}
                        </p>
                    </div>
                </div>
            </div>
        </SwiperSlide>
    ))}
</Swiper>

            </div>
        </section>
    );
}
