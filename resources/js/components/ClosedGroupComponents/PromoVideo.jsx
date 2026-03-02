import { useState } from "react";

export default function PromoVideo({ group }) {
    const [open, setOpen] = useState(false);

    if (!group) return null;

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className="relative group cursor-pointer overflow-hidden rounded-3xl border border-white/10 aspect-video"
            >
                {group.promo_image_url && (
                    <img
                        src={group.promo_image_url}
                        alt={group.promo_title}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                    />
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-t from-background-dark/80 to-transparent">
                    <button className="h-24 w-24 rounded-full bg-primary text-background-dark flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_50px_rgba(250,198,56,0.2)]">
                        <span className="material-symbols-outlined text-4xl">
                            play_arrow
                        </span>
                    </button>

                    <p className="text-2xl font-display text-white">
                        {group.promo_title}
                    </p>
                </div>
            </div>

            {/* VIDEO MODAL */}
            {open && group.promo_video_url && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                >
                    <div
                        className="relative w-full max-w-4xl aspect-video"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <video
                            src={group.promo_video_url}
                            controls
                            autoPlay
                            className="w-full h-full rounded-2xl"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
