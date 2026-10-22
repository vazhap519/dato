import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/footer.jsx";

const csrf = () => document.querySelector('meta[name="csrf-token"]')?.content;
async function api(url, options = {}) {
    const response = await fetch(url, {
        credentials: "same-origin",
        headers: { Accept: "application/json", "Content-Type": "application/json", "X-CSRF-TOKEN": csrf() || "", ...options.headers },
        ...options,
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Не удалось выполнить действие");
    }
    return response.json();
}

export default function Live() {
    const { sessions = [], initialSessionId } = usePage().props;
    const [sessionId, setSessionId] = useState(initialSessionId || null);
    const [session, setSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [guest, setGuest] = useState(null);
    const [name, setName] = useState("");
    const [draft, setDraft] = useState("");
    const [error, setError] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => { api("/live/guest").then(data => setGuest(data.name)).catch(() => {}); }, []);
    useEffect(() => {
        if (!sessionId) return;
        setMessages([]);
        let mounted = true;
        const refresh = async () => {
            try {
                const [details, chat] = await Promise.all([
                    api(`/live/api/sessions/${sessionId}`),
                    api(`/live/api/sessions/${sessionId}/messages`),
                ]);
                if (mounted) { setSession(details); setMessages(chat); }
            } catch { if (mounted) setError("Не удалось обновить эфир."); }
        };
        refresh();
        const interval = setInterval(refresh, 3000);
        return () => { mounted = false; clearInterval(interval); };
    }, [sessionId]);

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
            await api(`/live/api/sessions/${sessionId}/messages`, { method: "POST", body: JSON.stringify({ body: draft.trim() }) });
            setDraft("");
            setMessages(await api(`/live/api/sessions/${sessionId}/messages`));
        } catch (e) { setError(e.message); }
        finally { setSending(false); }
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#17140e] px-4 pb-20 pt-28 text-white sm:px-8">
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
                            </section>
                            <section className="flex min-h-[440px] flex-col overflow-hidden rounded-2xl border border-[#f5c542]/20 bg-[#221e17] lg:h-[600px]">
                                <div className="border-b border-white/10 p-4 font-semibold">Чат участников</div>
                                <div className="flex-1 space-y-4 overflow-y-auto p-4 lg:min-h-0" style={{ maxHeight: 390 }}>
                                    {messages.length === 0 && <p className="text-sm text-white/50">Пока нет сообщений. Начни разговор!</p>}
                                    {messages.map(msg => (
                                        <div key={msg.id}>
                                            <div className="mb-1 text-xs font-bold text-[#f5c542]">{msg.author_name}{msg.is_host ? " · Ведущий" : ""}</div>
                                            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-white/85">{msg.body}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-white/10 p-4">
                                    {!guest ? (
                                        <form onSubmit={join} className="flex flex-col gap-2">
                                            <label htmlFor="live-name" className="text-sm text-white/75">Как к тебе обращаться?</label>
                                            <input id="live-name" value={name} onChange={e => setName(e.target.value)} maxLength={40} minLength={2} required
                                                placeholder="Твоё имя" className="rounded-xl border border-white/20 bg-black/25 px-4 py-3 outline-none focus:border-[#f5c542]" />
                                            <button className="rounded-xl bg-[#f5c542] px-4 py-3 font-bold text-[#17140e]">Войти в чат</button>
                                        </form>
                                    ) : (
                                        <form onSubmit={send} className="flex gap-2">
                                            <input value={draft} onChange={e => setDraft(e.target.value)} maxLength={500}
                                                disabled={session?.status !== "live" || !session?.chat_enabled}
                                                placeholder={session?.status === "live" && session?.chat_enabled ? `Сообщение от ${guest}` : "Чат сейчас закрыт"}
                                                className="min-w-0 flex-1 rounded-xl border border-white/20 bg-black/25 px-3 py-3 text-sm outline-none focus:border-[#f5c542]" />
                                            <button disabled={sending || !draft.trim() || session?.status !== "live" || !session?.chat_enabled}
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
            <Footer />
        </>
    );
}
