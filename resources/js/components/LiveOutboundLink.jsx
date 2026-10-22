import { useState } from "react";

function telegramTarget(url) {
    try {
        const u = new URL(url);
        if (u.protocol === "tg:" && u.hostname === "resolve") return url;
        if (!["t.me", "www.t.me", "telegram.me", "www.telegram.me"].includes(u.hostname.toLowerCase())) return null;
        const path = u.pathname.split("/").filter(Boolean);
        if (path.length === 2 && /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(path[0]) && /^[a-zA-Z][a-zA-Z0-9_]{0,63}$/.test(path[1])) {
            const query = new URLSearchParams({domain:path[0],appname:path[1]});
            if (u.searchParams.get("startapp")) query.set("startapp",u.searchParams.get("startapp"));
            return "tg://resolve?" + query.toString();
        }
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
    const fallback = button.url.startsWith("tg://") ? (() => {
        try {
            const parsed = new URL(button.url);
            const domain = parsed.searchParams.get("domain");
            const appname = parsed.searchParams.get("appname");
            if (!domain || !/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(domain)) return null;
            const path = appname ? "/" + encodeURIComponent(appname) : "";
            const startapp = parsed.searchParams.get("startapp");
            return "https://t.me/" + domain + path + (startapp ? "?startapp=" + encodeURIComponent(startapp) : "");
        } catch { return null; }
    })() : button.url;
    const style = button.style === "outline"
        ? "rounded-xl border border-[#f5c542] px-4 py-3 text-sm text-[#f5c542]"
        : "rounded-xl bg-[#f5c542] px-4 py-3 text-sm font-bold text-[#17140e]";
    return <>
        {deep
            ? <a href={deep} onClick={e => { if (!button.url.startsWith("tg://")) { e.preventDefault(); setOpen(true); } }} className={style}>{button.label} ↗</a>
            : <a href={button.url} target="_blank" rel="noopener noreferrer" className={style}>{button.label} ↗</a>}
        {open && <div role="dialog" aria-modal="true" aria-label="Открыть Telegram" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4">
            <div className="w-full max-w-md space-y-4 rounded-2xl border border-[#f5c542]/40 bg-[#221e17] p-6 text-white shadow-2xl">
                <h3 className="text-lg font-bold">{button.label}</h3>
                <p className="text-sm leading-6 text-white/75">Попробуй открыть Telegram напрямую. Если встроенный браузер Facebook или Instagram не разрешает переход, открой обычную ссылку либо выбери в меню браузера «Открыть в браузере».</p>
                <a href={deep} className="block rounded-xl bg-[#f5c542] px-4 py-3 text-center text-sm font-bold text-[#17140e]">Открыть приложение Telegram ↗</a>
                {fallback && <a href={fallback} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-white/30 px-4 py-3 text-center text-sm">Открыть обычную ссылку ↗</a>}
                <button type="button" onClick={() => setOpen(false)} className="w-full py-2 text-sm text-white/60">Закрыть</button>
            </div>
        </div>}
    </>;
}
