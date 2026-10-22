import { useState } from "react";

export default function LiveActionButtons({ sessionId, buttons = [], canModerate, onRefresh, api }) {
    const [editing, setEditing] = useState(null);
    const [draft, setDraft] = useState({label:"",url:"",style:"gold",is_visible:false,sort_order:0});
    const [error, setError] = useState("");
    const edit = button => {
        setDraft(button ? {...button} : {label:"",url:"",style:"gold",is_visible:false,sort_order:buttons.length});
        setEditing(button ? button.id : "new");
    };
    const save = async e => {
        e.preventDefault();
        setError("");
        try {
            const root = "/live/api/sessions/" + sessionId + "/buttons";
            await api(editing === "new" ? root : root + "/" + editing, {
                method: editing === "new" ? "POST" : "PUT",
                body: JSON.stringify({...draft,sort_order:Number(draft.sort_order)||0})
            });
            setEditing(null);
            await onRefresh();
        } catch (e) { setError(e.message); }
    };
    const remove = async () => {
        if (!window.confirm("Удалить кнопку?")) return;
        try {
            await api("/live/api/sessions/" + sessionId + "/buttons/" + editing + "/remove", {method:"POST"});
            setEditing(null);
            await onRefresh();
        } catch (e) { setError(e.message); }
    };
    if (!canModerate && !buttons.length) return null;
    return <div className="space-y-3 border-t border-white/10 p-4">
        <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-[#f5c542]">Ссылки эфира</h3>
            {canModerate && <button type="button" onClick={() => edit(null)} className="rounded-lg border border-[#f5c542]/50 px-3 py-2 text-xs text-[#f5c542]">+ Добавить кнопку</button>}
        </div>
        <div className="flex flex-wrap gap-2">
            {buttons.map(button => <div key={button.id} className="flex items-center gap-1">
                <a href={button.url} target="_blank" rel="noopener noreferrer" className={button.style === "outline" ? "rounded-xl border border-[#f5c542] px-4 py-3 text-sm text-[#f5c542]" : "rounded-xl bg-[#f5c542] px-4 py-3 text-sm font-bold text-[#17140e]"}>{button.label} ↗</a>
                {canModerate && <button type="button" onClick={() => edit(button)} className="px-2 text-sm text-white/60">✎</button>}
                {canModerate && !button.is_visible && <span className="text-xs text-white/40">Скрыта</span>}
            </div>)}
        </div>
        {canModerate && editing !== null && <form onSubmit={save} className="space-y-3 rounded-xl border border-white/15 bg-black/20 p-4">
            <input required maxLength={90} placeholder="Название кнопки" value={draft.label} onChange={e => setDraft({...draft,label:e.target.value})} className="w-full rounded-lg border border-white/20 bg-[#17140e] p-3 text-sm" />
            <input required type="url" maxLength={2048} placeholder="https://t.me/..." value={draft.url} onChange={e => setDraft({...draft,url:e.target.value})} className="w-full rounded-lg border border-white/20 bg-[#17140e] p-3 text-sm" />
            <div className="flex flex-wrap items-center gap-3 text-xs">
                <select value={draft.style} onChange={e => setDraft({...draft,style:e.target.value})} className="rounded-lg border border-white/20 bg-[#17140e] p-2"><option value="gold">Золотая</option><option value="outline">Контурная</option></select>
                <label>Порядок <input type="number" min="0" max="10000" value={draft.sort_order} onChange={e => setDraft({...draft,sort_order:e.target.value})} className="w-16 rounded-lg border border-white/20 bg-[#17140e] p-2" /></label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={draft.is_visible} onChange={e => setDraft({...draft,is_visible:e.target.checked})} /> Показывать участникам</label>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
                <button type="submit" className="rounded-lg bg-[#f5c542] px-4 py-2 font-bold text-[#17140e]">Сохранить</button>
                <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-white/20 px-4 py-2">Отмена</button>
                {editing !== "new" && <button type="button" onClick={remove} className="rounded-lg border border-red-400/30 px-4 py-2 text-red-300">Удалить</button>}
            </div>
            {error && <p className="text-xs text-red-300">{error}</p>}
        </form>}
    </div>;
}
