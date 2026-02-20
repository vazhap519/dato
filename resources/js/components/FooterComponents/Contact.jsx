export default function Contact({footer}) {
    return (
        <div>
            <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-300">{footer.contact_title}</h5>
            <ul className="space-y-4 text-sm text-slate-500">
                <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">mail</span>
                    {footer.email}
                </li>
                <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                    {footer.location}
                </li>
            </ul>
        </div>
    )
}
