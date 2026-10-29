import React, { useEffect, useState } from 'react';

const KEY = 'arutyun-theme';
const OPTIONS = [
    { value: 'light', label: 'Светлая тема', icon: '☀' },
    { value: 'dark', label: 'Тёмная тема', icon: '☾' },
    { value: 'auto', label: 'Как на устройстве', icon: '◐' },
];

function preferenceFromStorage() {
    try {
        const value = window.localStorage.getItem(KEY);
        return OPTIONS.some(option => option.value === value) ? value : 'auto';
    } catch (_) {
        return 'auto';
    }
}

function applyTheme(preference) {
    const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
    const dark = preference === 'dark' || (preference === 'auto' && systemDark);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
}

export default function ThemeSwitcher() {
    const [preference, setPreference] = useState(preferenceFromStorage);

    useEffect(() => {
        applyTheme(preference);
        const media = window.matchMedia?.('(prefers-color-scheme: dark)');
        const onChange = () => { if (preference === 'auto') applyTheme('auto'); };
        media?.addEventListener?.('change', onChange);
        return () => media?.removeEventListener?.('change', onChange);
    }, [preference]);

    const choose = value => {
        setPreference(value);
        applyTheme(value);
        try { window.localStorage.setItem(KEY, value); } catch (_) {}
    };

    return (
        <div className="arutyun-theme-switcher" role="group" aria-label="Тема оформления">
            {OPTIONS.map(option => (
                <button key={option.value} type="button"
                    className="arutyun-theme-option"
                    aria-label={option.label} title={option.label}
                    aria-pressed={preference === option.value}
                    onClick={() => choose(option.value)}>
                    <span aria-hidden="true">{option.icon}</span>
                </button>
            ))}
        </div>
    );
}
