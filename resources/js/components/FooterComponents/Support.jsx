export default  function Support({footer}) {
    return (
        <div>
            <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-300">{footer.support_title}</h5>
            <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="hover:text-primary transition-colors" href="#">{footer.support_faq}</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">{footer.support_offer} </a></li>
                <li><a className="hover:text-primary transition-colors" href="#">{footer.support_payment} </a>
                </li>
                <li><a className="hover:text-primary transition-colors" href="#"> {footer.support_privacy}</a></li>
            </ul>
        </div>
    )
}
