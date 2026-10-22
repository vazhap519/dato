import { useState } from "react";

function telegramTarget(url) {
    try {
        const u = new URL(url);
        if (!["t.me", "www.t.me", "telegram.me", "www.telegram.me"].includes(u.hostname.toLowerCase())) return null;
        const path = u.pathname.split("/").filter(Boolean);
        if (path.length !== 1) return null;
        const handle = path[0];
        if (/^\+[a-zA-Z0-9_-]+$/.test(handle)) return "tg://join?invite=" + encodeURIComponent(handle.slice(1));
        if (/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(handle)) return "tg://resolve?domain=" + encodeURIComponent(handle);
    } catch {}
    return null;
}

export default function LiveOutboundLink({ button }) {
    const [open, setOpen] = useState(false);
    const deep = telegramTarget(button.url);
    const style = button.style === "outline"
        ? "rounded-xl border border-[#f5c542] px-4 py-3 text-sm text-[#f5c542]"
        : "rounded-xl bg-[#f5c542] px-4 py-3 text-sm font-bold text-[#17140e]";
    return <>
        {deep
            ? <button type="button" onClick={() => setOpen(true)} className={style}>{button.label} ↗</button>
            : <a href={button.url} target="_blank" rel="noopener noreferrer" className={style}>{button.label} ↗</a>}
        {open && <div role="dialog" aria-modal="true" aria-label="Открыть Telegram" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4">
            <div className="w-full max-w-md space-y-4 rounded-2xl border border-[#f5c542]/40 bg-[#221e17] p-6 text-white shadow-2xl">
                <h3 className="text-lg font-bold">{button.label}</h3>
                <p className="text-sm leading-6 text-white/75">Попробуй открыть Telegram напрямую. Если встроенный браузер Facebook или Instagram не разрешает переход, открой обычную ссылку либо выбери в меню браузера «Открыть в браузере».</p>
                <a href={deep} className="block rounded-xl bg-[#f5c542] px-4 py-3 text-center text-sm font-bold text-[#17140e]">Открыть приложение Telegram ↗</a>
                <a href={button.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-white/30 px-4 py-3 text-center text-sm">Открыть обычную ссылку ↗</a>
                <button type="button" onClick={() => setOpen(false)} className="w-full py-2 text-sm text-white/60">Закрыть</button>
            </div>
        </div>}
    </>;
}
