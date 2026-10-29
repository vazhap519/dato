import React, { useEffect, useId, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';

/**
 * Stroke-based icons are part of the component itself.
 * Unlike Material Symbols, their alignment does not depend on a web font,
 * installed glyphs, ligatures or third-party CSS.
 */
const iconArtwork = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m16.2 16.2 4.1 4.1" /></>,
    schedule: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
    auto_awesome: <><path d="m12 2 1.9 5.7L19.5 9.5l-5.6 1.8L12 17l-1.9-5.7L4.5 9.5l5.6-1.8zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z" /></>,
    menu_book: <><path d="M12 6c-2.4-1.4-5.6-1.8-9-1.3v14c3.4-.5 6.6-.1 9 1.3 2.4-1.4 5.6-1.8 9-1.3v-14c-3.4-.5-6.6-.1-9 1.3Z" /><path d="M12 6v14" /></>,
    grid_view: <><rect x="3" y="3" width="7" height="7" rx="1.4" /><rect x="14" y="3" width="7" height="7" rx="1.4" /><rect x="3" y="14" width="7" height="7" rx="1.4" /><rect x="14" y="14" width="7" height="7" rx="1.4" /></>,
    apps: <><rect x="3" y="3" width="5" height="5" rx="1" /><rect x="10" y="3" width="5" height="5" rx="1" /><rect x="17" y="3" width="4" height="5" rx="1" /><rect x="3" y="10" width="5" height="5" rx="1" /><rect x="10" y="10" width="5" height="5" rx="1" /><rect x="17" y="10" width="4" height="5" rx="1" /><rect x="3" y="17" width="5" height="4" rx="1" /><rect x="10" y="17" width="5" height="4" rx="1" /><rect x="17" y="17" width="4" height="4" rx="1" /></>,
    explore: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z" /></>,
    help_outline: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.6 2.6 0 0 1 5 .8c0 1.8-2.5 2.2-2.5 4.2" /><path d="M12 17.5h.01" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    forum: <><path d="M4 5h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M8 9h6M8 12h5" /></>,
    spa: <><path d="M12 20c-5-4-6-8-3-13 2 1 3 3 3 6 0-3 1-5 3-6 3 5 2 9-3 13ZM12 20c-4 0-7-2-9-6 4-1 6 0 9 6ZM12 20c4 0 7-2 9-6-4-1-6 0-9 6Z" /></>,
    bedtime: <><path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z" /></>,
    auto_stories: <><path d="M12 7c-2.3-1.4-5.4-1.7-9-1.1v13.5c3.6-.6 6.7-.3 9 1.1 2.3-1.4 5.4-1.7 9-1.1V5.9c-3.6-.6-6.7-.3-9 1.1Z" /><path d="M12 7v13.5M17.5 2v4M15.5 4h4" /></>,
    wb_twilight: <><path d="M3 18h18M5 14a7 7 0 0 1 14 0M12 2v3M4.2 5.2l2.1 2.1M19.8 5.2l-2.1 2.1M2 11h2M20 11h2" /></>,
    self_improvement: <><circle cx="12" cy="4.5" r="2" /><path d="M4 10c2.5 2 4.5 3 8 3s5.5-1 8-3M12 13v3M6 21l6-5 6 5M8 21h8" /></>,
    wb_sunny: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>,
    psychology: <><path d="M12 5a4 4 0 0 0-7.2 2.4A4 4 0 0 0 5 15a3.8 3.8 0 0 0 7 2V5ZM12 5a4 4 0 0 1 7.2 2.4A4 4 0 0 1 19 15a3.8 3.8 0 0 1-7 2" /><path d="M9 9c-2 0-3 2-2 3M15 9c2 0 3 2 2 3M12 12v6" /></>,
    route: <><circle cx="6" cy="18" r="2" /><path d="M8 18h8a4 4 0 0 0 0-8H8a4 4 0 1 1 0-8h7" /><path d="m13 0 3 2-3 2" /></>,
    repeat: <><path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3" /></>,
    lightbulb: <><path d="M9 18h6M10 21h4M9 15.5c-1-1.2-3-3.2-3-6a6 6 0 1 1 12 0c0 2.8-2 4.8-3 6l-.4 2.5h-5.2z" /></>,
    visibility: <><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="2.8" /></>,
    account_tree: <><rect x="2" y="3" width="7" height="6" rx="1" /><rect x="15" y="3" width="7" height="6" rx="1" /><rect x="8.5" y="16" width="7" height="6" rx="1" /><path d="M9 6h3v6m3-6h-3M12 12v4" /></>,
    balance: <><path d="M12 3v17M5 20h14M4 7h16M7 7l-4 7h8L7 7ZM17 7l-4 7h8l-4-7Z" /></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="M5 5l14 14M19 5 5 19" />,
    check: <path d="m4 12 5 5L20 6" />,
    'chevron-right': <path d="m9 5 7 7-7 7" />,
    'chevron-down': <path d="m5 9 7 7 7-7" />,
    'arrow-right': <path d="M4 12h16m-6-6 6 6-6 6" />,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z" /></>,
};

function NavIcon({ name, className = 'h-5 w-5' }) {
    return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
        className={'block shrink-0 ' + className}>
        {iconArtwork[name] || iconArtwork['arrow-right']}
    </svg>;
}


/**
 * A single navigation pattern for all six "Explore yourself" landing pages.
 *
 * items: [{ label, href, icon?, onClick? }]
 * Internal section links use normal anchors so the browser scrolls naturally.
 * Full paths use Inertia links; Numbers can optionally clear its active number.
 */
export default function ExploreSectionNavigation({ items = [], label = 'Разделы' }) {
    const [open, setOpen] = useState(false);
    const [currentHash, setCurrentHash] = useState('');
    const menuRef = useRef(null);
    const menuId = useId();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const syncHash = () => setCurrentHash(window.location.hash || '');
        syncHash();
        window.addEventListener('hashchange', syncHash);
        return () => window.removeEventListener('hashchange', syncHash);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onPointerDown = event => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        const onKeyDown = event => {
            if (event.key === 'Escape') {
                setOpen(false);
                menuRef.current?.querySelector('button[aria-expanded]')?.focus();
            }
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    const mainItems = items.filter(item => !item.catalog);
    const catalogItem = items.find(item => item.catalog);
    const closeAndNavigate = item => {
        setOpen(false);
        if (item.href.startsWith('#')) {
            setCurrentHash(item.href);
        }
        item.onClick?.();
    };
    const isActive = item => item.href.startsWith('#') && item.href === currentHash;

    const renderItem = (item, mobile = false) => {
        const destinationIsSection = item.href.startsWith('#');
        const active = isActive(item);
        const desktopClass = 'inline-flex shrink-0 items-center whitespace-nowrap text-sm transition-colors focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] ' +
            (item.catalog ? 'text-[#b9a98e] hover:text-white' : 'text-[#e4c88c] hover:text-white');
        const mobileClass = 'group flex w-full items-center gap-3 rounded-xl px-3.5 py-3.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] ' +
            (active ? 'bg-[#40301d] text-[#ffdc83]' : 'text-[#eadac0] hover:bg-[#30271c]');
        const className = mobile ? mobileClass : desktopClass;
        const children = mobile ? <>
            <span aria-hidden="true" className={'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ' +
                (active ? 'border-[#c5994a]/80 bg-[#4e3920] text-[#ffcf6e]' : 'border-[#6a5331]/70 bg-[#271f16] text-[#d5b06c]')}>
                <NavIcon name={item.icon || (item.catalog ? 'apps' : 'arrow-right')} className="h-[19px] w-[19px]" />
            </span>
            <span className="min-w-0 flex-1 text-sm font-medium leading-6">{item.label}</span>
            <span aria-hidden="true" className={active ? 'text-[#f0c453]' : 'text-[#968467]'}>
                <NavIcon name={active ? 'check' : 'chevron-right'} className="h-4 w-4" />
            </span>
        </> : <>{item.label}{item.catalog ? ' →' : null}</>;

        if (destinationIsSection) {
            return <a key={item.href} href={item.href} className={className}
                aria-current={active ? 'location' : undefined}
                onClick={() => closeAndNavigate(item)}>{children}</a>;
        }
        return <Link key={item.href} href={item.href} className={className}
            onClick={() => closeAndNavigate(item)}>{children}</Link>;
    };

    return <div ref={menuRef} className="relative ml-auto shrink-0">
        <nav className="hidden items-center gap-4 xl:flex xl:gap-5" aria-label="Навигация по разделам страницы">
            {mainItems.map(item => renderItem(item))}
            {catalogItem && renderItem(catalogItem)}
        </nav>

        <div className="xl:hidden">
            <button type="button" aria-label={open ? 'Закрыть меню разделов' : 'Открыть меню разделов'}
                aria-expanded={open} aria-controls={menuId}
                onClick={() => setOpen(value => !value)}
                className={'flex min-h-[44px] items-center gap-2.5 rounded-xl border px-3.5 py-2 text-sm font-medium shadow-[0_2px_16px_rgba(0,0,0,.12)] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0c453] ' +
                    (open ? 'border-[#e3b85e] bg-[#49351f] text-[#ffe7ae]' : 'border-[#947544]/80 bg-[#251f17] text-[#f0c453] hover:border-[#e3b85e] hover:bg-[#332717]')}>
                <NavIcon name={open ? 'close' : 'menu'} className="h-[21px] w-[21px]" />
                <span>{label}</span>
                <span aria-hidden="true" className={'transition-transform duration-200 ' + (open ? 'rotate-180' : '')}>
                    <NavIcon name="chevron-down" className="h-4 w-4" />
                </span>
            </button>

            {open && <nav id={menuId} aria-label="Перейти к разделу страницы"
                className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-[#aa8749] bg-[#211b14] shadow-[0_20px_60px_rgba(0,0,0,.68)]">
                <div className="flex items-center justify-between gap-3 border-b border-[#796038]/60 bg-gradient-to-r from-[#352819] to-[#241c14] px-4 py-3.5">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[.19em] text-[#e8bb5a]">Быстрая навигация</p>
                        <p className="mt-0.5 text-xs leading-5 text-[#c8b69b]">Куда хочешь перейти?</p>
                    </div>
                    <span aria-hidden="true" className="text-[#ad8950]"><NavIcon name="compass" className="h-6 w-6" /></span>
                </div>
                <div className="max-h-[min(62vh,440px)] overflow-y-auto overscroll-contain p-2">
                    {mainItems.map(item => renderItem(item, true))}
                </div>
                {catalogItem && <div className="border-t border-[#796038]/60 bg-[#17140f] p-2">
                    {renderItem(catalogItem, true)}
                </div>}
            </nav>}
        </div>
    </div>;
}
