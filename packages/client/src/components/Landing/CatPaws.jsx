import CatHandsSvg from "../../assets/Cat_hands.svg";

export default function CatPaws() {
    return (
        <div className="relative z-0">
            <img
                src={CatHandsSvg}
                alt="Cat paws"
                className="w-full h-auto max-h-96 object-contain object-bottom -mt-24"
            />
        </div>
    );
}
