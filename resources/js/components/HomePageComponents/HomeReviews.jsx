import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HomeReviews({ review }) {
    const testimonials = Array.isArray(review?.content) ? review.content.filter(item => item?.description?.trim()) : [];
    if (!review || testimonials.length === 0) return null;
    return (
        <section className="py-12 md:py-28 bg-card-dark/30" aria-label="Истории участников">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-7 md:mb-10">
                    <p className="text-primary text-xs sm:text-sm font-bold tracking-widest uppercase mb-4">{review.review_sm_header}</p>
                    <h2 className="text-3xl md:text-5xl font-bold">{review.review_xl_header}</h2>
                </div>
                <Swiper
                    modules={[Navigation, Pagination, A11y]}
                    spaceBetween={16}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{ 900: { slidesPerView: 2 } }}
                    className="pb-14 mobile-reviews [&_.swiper-button-next]:text-primary [&_.swiper-button-prev]:text-primary [&_.swiper-pagination-bullet-active]:bg-primary"
                >
                    {testimonials.map((item, index) => (
                        <SwiperSlide key={index} className="h-auto">
                            <figure className="h-full rounded-2xl bg-card-dark border border-white/10 p-5 md:p-10 flex flex-col">
                                <span className="material-symbols-outlined text-primary text-4xl mb-4" aria-hidden="true">format_quote</span>
                                <blockquote className="text-slate-200 text-base md:text-lg italic leading-relaxed flex-1">«{item.description}»</blockquote>
                                <figcaption className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10">
                                    <div className="size-12 shrink-0 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                                        {item.u_image ? <img src={item.u_image.startsWith("/") || item.u_image.startsWith("http") ? item.u_image : `/storage/${item.u_image}`} alt="" loading="lazy" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-white/40" aria-hidden="true">person</span>}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{[item.name, item.lastname].filter(Boolean).join(" ")}</p>
                                        {item.position && <p className="text-xs text-slate-400 mt-1">{item.position}</p>}
                                    </div>
                                </figcaption>
                            </figure>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
