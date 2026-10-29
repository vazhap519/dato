import React, { useEffect, useState } from 'react';

const KEY = 'arutyun-theme';
const OPTIONS = [
    { value: 'auto', label: 'Как на устройстве' },
    { value: 'light', label: 'Светлая' },
    { value: 'dark', label: 'Тёмная' },
];

function readPreference() {
    try {
        const value = window.localStorage.getItem(KEY);
        return OPTIONS.some(option => option.value === value) ? value : 'auto';
    } catch (_) {
        return 'auto';
    }
}

function applyTheme(preference) {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = preference === 'dark' || (preference === 'auto' && systemDark);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
}

export default function ThemeSwitcher() {
    const [preference, setPreference] = useState('auto');

    useEffect(() => {
        const initial = readPreference();
        setPreference(initial);
        applyTheme(initial);
    }, []);

    useEffect(() => {
        applyTheme(preference);
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = () => { if (preference === 'auto') applyTheme('auto'); };
        media.addEventListener?.('change', onChange);
        return () => media.removeEventListener?.('change', onChange);
    }, [preference]);

    const changePreference = value => {
        setPreference(value);
        applyTheme(value);
        try { window.localStorage.setItem(KEY, value); } catch (_) {}
    };

    return (
        <div className="arutyun-theme-switcher" role="group" aria-label="Тема оформления сайта">
            <span className="arutyun-theme-switcher__icon" aria-hidden="true">◐</span>
            <label className="sr-only" htmlFor="arutyun-theme-preference">Тема оформления</label>
            <select id="arutyun-theme-preference" value={preference}
                onChange={event => changePreference(event.target.value)}
                aria-label="Тема оформления сайта">
                {OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
        </div>
    );
}
