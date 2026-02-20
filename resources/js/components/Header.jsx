import Navigation from "@/components/headerComponents/Navigation.jsx";
export default function Header() {
    return(
        <header className="fixed top-0 w-full z-50 glass-nav border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="size-10 bg-primary rounded-lg flex items-center justify-center text-background-dark">
                        <span className="material-symbols-outlined font-bold">self_improvement</span>
                    </div>
                </div>
<Navigation />
            </div>
        </header>
    )
}
