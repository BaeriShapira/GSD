import logoUrl from "../assets/GSD_LOGO.svg";

export default function Header() {
    return (
        <div className="w-full flex justify-center pt-6">
            <div className="w-[96%] md:w-[92%] lg:w-[88%] bg-brand-primary rounded-[28px] shadow-[0_6px_0_0_rgba(36,23,54,1)]">
                <div className="flex items-center gap-4 md:gap-5 px-6 md:px-8 py-3">
                    <img
                        src={logoUrl}
                        alt="GSD cat"
                        className="w-40 h-10 md:w-80 md:h-20 object-contain select-none"
                        draggable="false"
                    />

                </div>
            </div>
        </div>
    );
}
