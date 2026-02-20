import { usePage, Link } from "@inertiajs/react";

export default function NotFound() {
    const { not_found } = usePage().props;

    return (
        <main className="flex-1 flex flex-col items-center justify-center relative px-6 text-center">
            <div className="absolute inset-0 pointer-events-none overflow-hidden rays-container">
                <div className="absolute top-1/4 left-1/4 w-[32rem] h-[32rem] bg-primary/5 rounded-full soft-glow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-primary/10 rounded-full soft-glow"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-screen bg-gradient-to-b from-primary/10 via-primary/5 to-transparent opacity-50"></div>
            </div>

            <div className="max-w-2xl w-full z-10 flex flex-col items-center">
                <div className="relative w-64 h-64 mb-16 flex items-center justify-center">
                    <div className="absolute inset-0 border border-primary/20 rounded-full animate-[pulse_8s_infinite]"></div>
                    <div className="absolute inset-8 border border-primary/10 rounded-full animate-[pulse_12s_infinite]"></div>

                    <div className="w-24 h-24 relative z-10">
                        <svg className="w-full h-full text-primary/70" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M50 10C50 10 20 40 20 60C20 76.5685 33.4315 90 50 90C66.5685 90 80 76.5685 80 60C80 40 50 10 50 10Z"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.2"
                            />
                            <circle cx="50" cy="60" fill="currentColor" fillOpacity="0.1" r="14" />
                            <path d="M50 25V40" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
                        </svg>
                    </div>

                    <div className="absolute w-20 h-20 bg-primary/10 rounded-full blur-2xl"></div>
                </div>

                <div className="space-y-6 mb-14">
                    <h1 className="text-[#181611] dark:text-white text-5xl md:text-7xl font-display font-light tracking-tight italic">
                        {not_found?.not_found_title ?? "Страница не найдена"}
                    </h1>

                    <p className="text-lg md:text-2xl text-[#181611]/60 dark:text-white/50 font-display max-w-lg leading-relaxed mx-auto">
                        {not_found?.not_found_content ?? "Возможно, вы свернули не туда. Давайте вернёмся к началу."}
                    </p>
                </div>

                <div className="flex justify-center">
                    <Link
                        href="/"
                        className="min-w-[280px] h-16 bg-primary text-[#181611] rounded-full font-bold text-lg shadow-[0_10px_40px_-10px_rgba(232,186,48,0.3)] hover:shadow-[0_15px_50px_-10px_rgba(232,186,48,0.5)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined text-2xl">home</span>
                        {not_found?.not_found_button_text ?? "Вернуться на главную"}
                    </Link>
                </div>
            </div>

            <div className="mt-24 opacity-10 dark:opacity-5 max-w-5xl w-full">
                <svg className="w-full" fill="none" viewBox="0 0 800 120" xmlns="http://www.w3.org/2000/svg">
                    <path
                        className="text-[#181611] dark:text-white"
                        d="M0 80C100 80 150 20 250 20C350 20 450 100 550 100C650 100 700 40 800 40"
                        stroke="currentColor"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                    />
                    <circle className="text-primary" cx="250" cy="20" fill="currentColor" r="4" />
                    <circle className="text-primary" cx="550" cy="100" fill="currentColor" r="4" />
                </svg>
            </div>
        </main>
    );
}
