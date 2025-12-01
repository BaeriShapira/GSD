import logoUrl from "../../assets/GSD_LOGO_PURPLE.svg";

export default function SidebarLogo() {
    return (
        <div className="flex justify-center items-center gap-2 px-2 pt-4">
            <img
                src={logoUrl}
                alt="GSD cat"
                className="w-45 object-contain select-none"
                draggable="false"
            />
        </div>
    );
}
