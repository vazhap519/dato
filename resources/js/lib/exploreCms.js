/**
 * Live editorial content, delivered by Laravel/Inertia on each page request.
 *
 * No public editing endpoint and no client write API. Admin updates are
 * available after refreshing the page, with no Vite rebuild.
 */
let activeCms = null;

function readInitialCms() {
    if (typeof document === 'undefined') return {};
    try {
        const raw = document.getElementById('app')?.dataset?.page;
        return JSON.parse(raw || '{}')?.props?.exploreCms || {};
    } catch {
        return {};
    }
}

function currentCms() {
    return activeCms || readInitialCms();
}

export function setExploreCms(page) {
    activeCms = page?.props?.exploreCms || {};
}

export function readExploreCopy(key, original) {
    const value = currentCms()?.copy?.[key];
    if (typeof value !== 'string') return original;
    if (value === original) return original;

    // Preserve essential whitespace between separate JSX fragments,
    // for example "Язык " + <span>эмоций</span>.
    const leading = original.match(/^\s*/)?.[0] || '';
    const trailing = original.match(/\s*$/)?.[0] || '';
    return leading + value.trim() + trailing;
}

/**
 * A lazy recursive proxy means source modules can hold a stable reference
 * while Inertia navigates between directions and delivers fresh DB content.
 * Lists keep Array.isArray === true and retain native map/find/filter behavior.
 */
export function liveExploreDocument(name, fallback) {
    const proxies = new Map();

    const current = path => {
        let value = currentCms()?.documents?.[name] || fallback;
        for (const part of path) {
            if (value == null) return undefined;
            value = value[part];
        }
        return value;
    };

    const wrap = path => {
        const key = path.map(String).join('.');
        if (proxies.has(key)) return proxies.get(key);

        const original = path.reduce((value, part) => value?.[part], fallback);
        if (original === null || typeof original !== 'object') return current(path);

        const proxy = new Proxy(Array.isArray(original) ? [] : {}, {
            get(_target, property) {
                const object = current(path) ?? original;
                if (typeof property === 'symbol') {
                    const symbolValue = Reflect.get(object, property, object);
                    return typeof symbolValue === 'function' ? symbolValue.bind(object) : symbolValue;
                }
                const value = object?.[property];
                if (typeof value === 'function') return value.bind(object);
                if (value !== null && typeof value === 'object') return wrap([...path, property]);
                return value;
            },
            has(_target, property) {
                return property in (current(path) ?? original);
            },
            ownKeys() {
                return Reflect.ownKeys(current(path) ?? original);
            },
            getOwnPropertyDescriptor(target, property) {
                if (Array.isArray(target) && property === 'length') {
                    return Object.getOwnPropertyDescriptor(target, 'length');
                }
                const descriptor = Object.getOwnPropertyDescriptor(current(path) ?? original, property);
                return descriptor ? { ...descriptor, configurable: true } : undefined;
            },
        });
        proxies.set(key, proxy);
        return proxy;
    };

    return wrap([]);
}
