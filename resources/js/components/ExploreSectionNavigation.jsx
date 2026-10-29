import React, { useEffect, useId, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';

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
            <span aria-hidden="true" className={'material-symbols-outlined flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xl ' +
                (active ? 'border-[#c5994a]/80 bg-[#4e3920] text-[#ffcf6e]' : 'border-[#6a5331]/70 bg-[#271f16] text-[#d5b06c]')}>
                {item.icon || (item.catalog ? 'apps' : 'arrow_forward')}
            </span>
            <span className="min-w-0 flex-1 text-sm font-medium leading-6">{item.label}</span>
            <span aria-hidden="true" className={'material-symbols-outlined text-lg ' + (active ? 'text-[#f0c453]' : 'text-[#968467]')}>
                {active ? 'check' : 'arrow_forward_ios'}
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
                <span aria-hidden="true" className="material-symbols-outlined text-[22px]">{open ? 'close' : 'menu'}</span>
                <span>{label}</span>
                <span aria-hidden="true" className={'material-symbols-outlined text-base transition-transform duration-200 ' + (open ? 'rotate-180' : '')}>expand_more</span>
            </button>

            {open && <nav id={menuId} aria-label="Перейти к разделу страницы"
                className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-[#aa8749] bg-[#211b14] shadow-[0_20px_60px_rgba(0,0,0,.68)]">
                <div className="flex items-center justify-between gap-3 border-b border-[#796038]/60 bg-gradient-to-r from-[#352819] to-[#241c14] px-4 py-3.5">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[.19em] text-[#e8bb5a]">Быстрая навигация</p>
                        <p className="mt-0.5 text-xs leading-5 text-[#c8b69b]">Куда хочешь перейти?</p>
                    </div>
                    <span aria-hidden="true" className="material-symbols-outlined text-2xl text-[#ad8950]">explore</span>
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
