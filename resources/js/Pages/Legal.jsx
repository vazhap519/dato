import { useEffect } from "react";
import { Head } from "@inertiajs/react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/footer.jsx";
const docs = [
 {slug:"terms",title:"Условия использования",description:"Правила пользования сайтом, материалами и бесплатными сервисами."},
 {slug:"privacy",title:"Политика конфиденциальности",description:"Какие данные собираются и как они обрабатываются."},
 {slug:"offer",title:"Публичная оферта · Круг Души",description:"Условия платного доступа к закрытому сообществу."}
];
export default function Legal() {
 useEffect(() => {
  const legacy = { "#agreement":"/terms", "#privacy":"/privacy", "#offer":"/offer" };
  if (legacy[window.location.hash]) window.location.replace(legacy[window.location.hash]);
 }, []);
 return <>
  <Head title="Юридическая информация — arutyun.me"><meta name="description" content="Условия использования, политика конфиденциальности и публичная оферта arutyun.me" /></Head>
  <Header />
  <main className="min-h-screen bg-background-dark text-white px-5 pt-32 pb-20">
   <div className="max-w-3xl mx-auto">
    <p className="text-primary text-xs font-bold tracking-widest uppercase mb-4">ARUTYUN.ME / Документы</p>
    <h1 className="text-3xl md:text-4xl font-bold mb-5">Юридическая информация</h1>
    <p className="text-white/60 leading-7 mb-10">Документы об использовании сайта, обработке персональных данных и условиях участия в платных проектах.</p>
    <div className="space-y-4">{docs.map(d => <a href={"/"+d.slug} key={d.slug} className="block rounded-2xl border border-white/15 p-6 hover:border-primary/50 hover:bg-white/[0.03] transition">
     <span className="text-xl font-semibold">{d.title} <span aria-hidden="true" className="text-primary">↗</span></span>
     <p className="text-white/60 text-sm leading-6 mt-2">{d.description}</p>
    </a>)}</div>
    <p className="text-white/50 text-sm mt-10">По вопросам документов обращайтесь через раздел контактов сайта.</p>
   </div>
  </main>
  <div className="legal-footer"><Footer /></div>
  <style>{`.legal-footer footer > div > div:first-child { display:none }`}</style>
 </>;
}
