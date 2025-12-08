import CatHandsSvg from "../../assets/Cat_hands.svg";

export default function CatPaws() {
    return (
        <div className="fixed bottom-0 left-0 right-0 pointer-events-none overflow-hidden z-10">
            <img
                src={CatHandsSvg}
                alt="Cat paws"
                className="w-full h-auto max-h-96 object-contain object-bottom"
            />
        </div>
    );
}
