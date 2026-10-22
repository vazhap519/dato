import { useEffect, useRef, useState } from "react";
import { usePage } from "@inertiajs/react";
import LiveActionButtons from "@/components/LiveActionButtons.jsx";

const csrf = () => document.querySelector('meta[name="csrf-token"]')?.content;
const xsrfCookie = () => {
    const value = document.cookie.split("; ").find(part => part.startsWith("XSRF-TOKEN="));
    return value ? decodeURIComponent(value.slice("XSRF-TOKEN=".length)) : null;
};
async function api(url, options = {}) {
    const cookieToken = xsrfCookie();
    const response = await fetch(url, {
        credentials: "same-origin",
        ...options,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(cookieToken ? { "X-XSRF-TOKEN": cookieToken } : { "X-CSRF-TOKEN": csrf() || "" }),
            ...options.headers,
        },
    });
    if (!response.ok) {
        if (response.status === 419) {
            throw new Error("Сессия устарела. Обнови страницу и повтори действие.");
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Не удалось выполнить действие");
    }
    return response.json();
}

export default function Live() {
    const { sessions = [], initialSessionId, canModerate = false, moderatorPermissions = [], isLiveModerator = false } = usePage().props;
    const can = permission => moderatorPermissions.includes(permission);
    const [sessionId, setSessionId] = useState(initialSessionId || null);
    const [session, setSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [guest, setGuest] = useState(null);
    const [name, setName] = useState("");
    const [draft, setDraft] = useState("");
    const [error, setError] = useState("");
    const [sending, setSending] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const [online, setOnline] = useState(null);
    const [editingButton, setEditingButton] = useState(null);
    const [buttonDraft, setButtonDraft] = useState({label:"",url:"",style:"gold",is_visible:false,sort_order:0});
    const [linkPrompt, setLinkPrompt] = useState(null);
    const chatEndRef = useRef(null);
    const chatScrollRef = useRef(null);
    const shouldStickToBottom = useRef(true);

    useEffect(() => {
        if (shouldStickToBottom.current) chatEndRef.current?.scrollIntoView({ block: "end", behavior: "instant" });
    }, [messages]);

    useEffect(() => { api("/live/guest").then(data => setGuest(data.name)).catch(() => {}); }, []);
    useEffect(() => {
        if (!sessionId) return;
        setMessages([]);
        setSession(null);
        setError("");
        setOpenMenu(null);
        setOnline(null);
        shouldStickToBottom.current = true;
        let mounted = true;
        let busy = false;
        const refresh = async () => {
            if (busy || document.hidden) return;
            busy = true;
            try {
                const [details, chat] = await Promise.all([
                    api(`/live/api/sessions/${sessionId}`),
                    api(`/live/api/sessions/${sessionId}/messages`),
                ]);
                if (mounted) {
                    setSession(previous => JSON.stringify(previous) === JSON.stringify(details) ? previous : details);
                    setMessages(previous => previous.length === chat.length && previous.every((msg, index) => msg.id === chat[index].id && msg.body === chat[index].body) ? previous : chat);
                }
            } catch { if (mounted) setError("Не удалось обновить эфир."); }
            finally { busy = false; }
        };
        refresh();
        const interval = setInterval(refresh, 1000);
        const onFocus = () => refresh();
        window.addEventListener("focus", onFocus);
        return () => { mounted = false; clearInterval(interval); window.removeEventListener("focus", onFocus); };
    }, [sessionId]);

    useEffect(() => {
        if (!sessionId) return;
        let active = true;
        const heartbeat = async () => {
            if (document.hidden) return;
            try {
                const data = await api(`/live/api/sessions/${sessionId}/presence`, { method: "POST" });
                if (active) setOnline(data.online);
            } catch { /* Presence is optional; chat stays available. */ }
        };
        heartbeat();
        const timer = setInterval(heartbeat, 15000);
        const onFocus = () => heartbeat();
        window.addEventListener("focus", onFocus);
        return () => { active = false; clearInterval(timer); window.removeEventListener("focus", onFocus); };
    }, [sessionId]);

    const editButton = button => {
        setButtonDraft(button || {label:"",url:"",style:"gold",is_visible:false,sort_order:0});
        setEditingButton(button ? button.id : "new");
    };
    const saveButton = async e => {
        e.preventDefault();
        setError("");
        try {
            const path = "/live/api/sessions/" + sessionId + "/buttons";
            await api(editingButton === "new" ? path : path + "/" + editingButton, {
                method: editingButton === "new" ? "POST" : "PUT",
                body: JSON.stringify({...buttonDraft, sort_order: Number(buttonDraft.sort_order) || 0})
            });
            setSession(await api("/live/api/sessions/" + sessionId));
            setEditingButton(null);
        } catch (e) { setError(e.message); }
    };
    const removeButton = async button => {
        if (!window.confirm("Удалить кнопку?")) return;
        try {
            await api("/live/api/sessions/" + sessionId + "/buttons/" + button.id + "/remove", {method:"POST"});
            setSession(await api("/live/api/sessions/" + sessionId));
            setEditingButton(null);
        } catch (e) { setError(e.message); }
    };
    const toggleChat = async () => {
        if (!session) return;
        setError("");
        try {
            const data = await api(`/live/api/sessions/${sessionId}/chat-control`, {
                method: "POST", body: JSON.stringify({ chat_enabled: !session.chat_enabled }),
            });
            setSession(previous => ({ ...previous, chat_enabled: data.chat_enabled }));
        } catch (e) { setError(e.message); }
    };

    const moderate = async (messageId, action) => {
        if (action === "ban_ip" && !window.confirm("Заблокировать IP на 24 часа и скрыть сообщение?")) return;
        if (action === "ban_guest" && !window.confirm("IP старого сообщения неизвестен. Заблокировать только эту гостевую сессию? В другом браузере пользователь сможет войти снова.")) return;
        setOpenMenu(null);
        setError("");
        try {
            await api(`/live/api/sessions/${sessionId}/messages/${messageId}/moderate`, {
                method: "POST", body: JSON.stringify({ action }),
            });
            const [details, chat] = await Promise.all([api(`/live/api/sessions/${sessionId}`), api(`/live/api/sessions/${sessionId}/messages`)]);
            setSession(details);
            setMessages(chat);
        } catch (e) { setError(e.message); }
    };

    const join = async e => {
        e.preventDefault();
        setError("");
        try { const data = await api("/live/join", { method: "POST", body: JSON.stringify({ name: name.trim() }) }); setGuest(data.name); }
        catch (e) { setError(e.message); }
    };
    const send = async e => {
        e.preventDefault();
        if (!draft.trim() || !sessionId || sending) return;
        setSending(true); setError("");
        try {
            await api(can('host') ? `/live/api/sessions/${sessionId}/host-message` : `/live/api/sessions/${sessionId}/messages`, { method: "POST", body: JSON.stringify({ body: draft.trim() }) });
            setDraft("");
            shouldStickToBottom.current = true;
            setMessages(await api(`/live/api/sessions/${sessionId}/messages`));
        } catch (e) { setError(e.message); }
        finally { setSending(false); }
    };

    return (
        <>
            <main className="min-h-screen bg-[#17140e] px-4 pb-16 pt-12 text-white sm:px-8 lg:pt-16">
                <div className="mx-auto max-w-7xl">
                    <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[.25em] text-[#f5c542]">Прямые эфиры · Arutyun</p>
                    <h1 className="mb-3 text-center text-3xl font-bold sm:text-5xl">Практикум «Познай СЕБЯ»</h1>
                    <p className="mb-8 text-center text-white/60">Смотри эфир и общайся с участниками прямо здесь.</p>
                    {sessions.length > 0 ? (
                        <div className="mb-7 flex flex-wrap justify-center gap-2">
                            {sessions.map(item => (
                                <button key={item.id} onClick={() => setSessionId(item.id)}
                                    className={`rounded-xl border px-4 py-3 text-sm transition ${sessionId === item.id ? "border-[#f5c542] bg-[#f5c542]/15 text-[#f5c542]" : "border-white/15 bg-white/5 hover:border-[#f5c542]/50"}`}>
                                    День {item.day} · {item.title}
                                </button>
                            ))}
                        </div>
                    ) : <p className="rounded-2xl border border-white/10 p-12 text-center text-white/70">Эфиры пока не опубликованы. Скоро увидимся!</p>}
                    {sessionId && (
                        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(310px,370px)]">
                            <section className="overflow-hidden rounded-2xl border border-[#f5c542]/20 bg-[#221e17]">
                                <div className="flex flex-wrap items-center justify-between gap-2 p-5">
                                    <h2 className="text-xl font-bold">{session?.title || "Прямой эфир"}</h2>
                                    <span className="rounded-full border border-[#f5c542]/30 px-3 py-1 text-xs text-[#f5c542]">
                                        {session?.status === "live" ? "● В эфире" : session?.status === "ended" ? "Эфир завершён" : "Скоро начнём"}
                                    </span>
                                </div>
                                <div className="aspect-video bg-black">
                                    {session?.youtube_id ? (
                                        <iframe title="Трансляция практикума" className="h-full w-full"
                                            src={`https://www.youtube-nocookie.com/embed/${session.youtube_id}?rel=0`}
                                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                                    ) : <div className="flex h-full items-center justify-center px-6 text-center text-white/50">Видео появится здесь перед началом эфира</div>}
                                </div>
                                {session?.description && <p className="p-5 text-sm leading-7 text-white/70">{session.description}</p>}
                                <LiveActionButtons sessionId={sessionId} buttons={session?.action_buttons || []} canModerate={can('buttons')} api={api} onRefresh={async () => setSession(await api("/live/api/sessions/" + sessionId))} />
                            </section>
                            <section className="flex min-h-[440px] flex-col overflow-hidden rounded-2xl border border-[#f5c542]/20 bg-[#221e17] lg:h-[600px]">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 p-4">
                                    <div className="font-semibold">Чат участников <span className="ml-2 text-xs font-normal text-white/50">{online === null ? "" : `● ${online} онлайн`}</span></div>
                                    {can('chat') && <button type="button" onClick={toggleChat} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${session?.chat_enabled ? "border-red-400/40 text-red-300 hover:bg-red-400/10" : "border-[#f5c542]/50 text-[#f5c542] hover:bg-[#f5c542]/10"}`}>{session?.chat_enabled ? "Закрыть чат" : "Открыть чат"}</button>}
                                </div>
                                {session?.pinned_message && <div className="border-b border-[#f5c542]/25 bg-[#f5c542]/10 px-4 py-3 text-sm">
                                    <div className="mb-1 flex items-center justify-between gap-2 text-xs font-bold text-[#f5c542]"><span>📌 Закреплено · {session.pinned_message.author_name}</span>{can('pin') && <button type="button" onClick={() => moderate(session.pinned_message.id, "unpin")} className="text-white/60 hover:text-white" aria-label="Открепить">✕</button>}</div>
                                    <p className="whitespace-pre-wrap break-words text-white/90">{session.pinned_message.body}</p>
                                </div>}
                                <div ref={chatScrollRef} onScroll={event => { const el = event.currentTarget; shouldStickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100; }} className="flex-1 space-y-4 overflow-y-auto p-4 lg:min-h-0" style={{ maxHeight: 390 }}>
                                    {messages.length === 0 && <p className="text-sm text-white/50">Пока нет сообщений. Начни разговор!</p>}
                                    {messages.map(msg => (
                                        <div key={msg.id} className={msg.is_hidden ? "relative rounded-lg border border-red-400/20 bg-red-400/5 p-2 opacity-60" : msg.is_host ? "relative rounded-xl border border-[#f5c542]/70 bg-[#f5c542]/15 p-3 shadow-sm" : msg.is_highlighted ? "relative rounded-lg border border-[#f5c542]/60 bg-[#f5c542]/10 p-2" : msg.author_name?.endsWith(" · Модератор") ? "relative rounded-xl border border-[#f5c542] bg-transparent p-3" : "relative"}>
                                            <div className={`mb-1 text-xs font-bold ${!msg.is_host && msg.author_name?.endsWith(" · Модератор") ? "text-[#f5c542]" : "text-[#f5c542]"}`}>{msg.is_host ? "✦ " : ""}{msg.author_name}{msg.is_host ? " · Ведущий" : ""}</div>
                                            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-white/85">{msg.body}</p>
                                            {(can('messages') || can('ban') || can('pin') || can('highlight')) && <div className={`absolute right-0 top-0 ${openMenu === msg.id ? "z-50" : "z-10"}`}>
                                                <button type="button" aria-label="Действия с сообщением" aria-expanded={openMenu === msg.id} onClick={() => setOpenMenu(openMenu === msg.id ? null : msg.id)}
                                                    className="rounded-lg px-2 py-1 text-lg leading-none text-white/50 hover:bg-white/10 hover:text-white">⋯</button>
                                                {openMenu === msg.id && <div className="absolute right-0 top-full z-50 w-44 overflow-hidden rounded-xl border border-[#f5c542]/40 bg-[#211b13] py-1 text-left text-xs shadow-2xl ring-1 ring-black/70" style={{ backgroundColor: "#211b13", isolation: "isolate" }}>
                                                    {can('messages') && <button type="button" onClick={() => moderate(msg.id, msg.is_hidden ? "show" : "hide")} className="block w-full px-3 py-2 text-left hover:bg-white/10">{msg.is_hidden ? "↩ Восстановить" : "🗑 Удалить"}</button>}
                                                    {can('ban') && (msg.ip_hash || msg.live_guest_id) && <button type="button" onClick={() => moderate(msg.id, msg.ip_hash ? "ban_ip" : "ban_guest")} className="block w-full px-3 py-2 text-left text-red-300 hover:bg-white/10">⛔ {msg.ip_hash ? "Заблокировать IP" : "Заблокировать гостя"}</button>}
                                                    {can('pin') && !msg.is_hidden && <button type="button" onClick={() => moderate(msg.id, session?.pinned_message?.id === msg.id ? "unpin" : "pin")} className="block w-full px-3 py-2 text-left hover:bg-white/10">{session?.pinned_message?.id === msg.id ? "📌 Открепить" : "📌 Закрепить"}</button>}
                                                    {can('highlight') && <button type="button" onClick={() => moderate(msg.id, msg.is_highlighted ? "unhighlight" : "highlight")} className="block w-full px-3 py-2 text-left hover:bg-white/10">{msg.is_highlighted ? "✧ Убрать подсветку" : "✨ Подсветить"}</button>}
                                                </div>}
                                            </div>}
                                            {msg.is_hidden && <div className="mt-1 text-xs text-red-300">Скрыто от зрителей</div>}
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} aria-hidden="true" />
                                </div>
                                <div className="border-t border-white/10 p-4">
                                    {!guest && !can('host') ? (
                                        <form onSubmit={join} className="flex flex-col gap-2">
                                            <label htmlFor="live-name" className="text-sm text-white/75">Как к тебе обращаться?</label>
                                            <input id="live-name" value={name} onChange={e => setName(e.target.value)} maxLength={40} minLength={2} required
                                                placeholder="Твоё имя" className="rounded-xl border border-white/20 bg-black/25 px-4 py-3 outline-none focus:border-[#f5c542]" />
                                            <button className="rounded-xl bg-[#f5c542] px-4 py-3 font-bold text-[#17140e]">Войти в чат</button>
                                        </form>
                                    ) : (
                                        <form onSubmit={send} className="flex gap-2">
                                            <input value={draft} onChange={e => setDraft(e.target.value)} maxLength={500}
                                                disabled={!can('host') && (session?.status !== "live" || !session?.chat_enabled)}
                                                placeholder={can('host') ? "Сообщение от Давид · Ведущий" : session?.status === "live" && session?.chat_enabled ? `Сообщение от ${guest}` : "Чат сейчас закрыт"}
                                                className="min-w-0 flex-1 rounded-xl border border-white/20 bg-black/25 px-3 py-3 text-sm outline-none focus:border-[#f5c542]" />
                                            <button disabled={sending || !draft.trim() || (!can('host') && (session?.status !== "live" || !session?.chat_enabled))}
                                                className="rounded-xl bg-[#f5c542] px-4 font-bold text-[#17140e] disabled:opacity-40">➤</button>
                                        </form>
                                    )}
                                    {error && <p role="alert" className="mt-2 text-xs text-red-300">{error}</p>}
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </main>
            {isLiveModerator && <form method="POST" action="/moderator/logout" className="mx-auto max-w-7xl px-4 pb-4"><input type="hidden" name="_token" value={csrf() || ''} /><button type="submit" className="text-sm text-white/60 underline">Выйти из режима модератора</button></form>}
        </>
    );
}
