import SelfImprovent from "@/components/FooterComponents/SelfImprovent.jsx";
import {usePage} from "@inertiajs/react";

export default function Footer() {
    const { footer, navigation } = usePage().props;

    return (
        <footer className="bg-background-dark border-t border-white/5 pt-20 pb-10" id="contacts">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <SelfImprovent footer={footer} navigation={navigation} />
                </div>.

            </div>
        </footer>
                )
                }
