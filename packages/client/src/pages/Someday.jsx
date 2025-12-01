import SomedayBoard from "../components/someday/SomedayBoard";


export default function Someday() {
    return (
        <section className="p-2">
            <div className="px-4">
                <h1>Someday / Maybe</h1>
                <p>Ideas and things you might want to do in the future.</p>
            </div>
            <SomedayBoard />
        </section>
    );
}
