import WaitingForBoard from "../components/waiting_for/WaitingForBoard";

export default function WaitingFor() {
    return (
        <section className="p-2">
            <div className="px-4">
                <h1>Waiting For</h1>
                <p>Things you're waiting on from others.</p>
            </div>
            <WaitingForBoard />
        </section>
    );
}
