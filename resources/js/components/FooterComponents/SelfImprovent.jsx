import Support from "@/components/FooterComponents/Support.jsx";
import Contact from "@/components/FooterComponents/Contact.jsx";
import FooterNavigation from "@/components/FooterComponents/FooterNavigation.jsx";

export default function SelfImprovent({ footer ,navigation}) {

    return (
        <>

                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-3 mb-6">
                        <div
                            className="size-8 bg-primary rounded flex items-center justify-center text-background-dark">
                            <span className="material-symbols-outlined text-sm font-bold">self_improvement</span>
                        </div>
                        <span className="font-bold tracking-tight uppercase">{footer.brand_name}</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        {footer.description}                    </p>
                    <div className="flex gap-4">
                        <a className="size-10 rounded-lg bg-card-dark border border-white/5 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                           href="#">
                            <span className="material-symbols-outlined text-lg">play_circle</span>
                        </a>
                        <a className="size-10 rounded-lg bg-card-dark border border-white/5 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                           href="#">
                            <span className="material-symbols-outlined text-lg">chat</span>
                        </a>
                        <a className="size-10 rounded-lg bg-card-dark border border-white/5 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                           href="#">
                            <span className="material-symbols-outlined text-lg">share</span>
                        </a>
                    </div>
                </div>
            <FooterNavigation footer={footer} navigation={navigation} />
           <Support footer={footer} />
             <Contact footer={footer}/>

        </>
    )
}
