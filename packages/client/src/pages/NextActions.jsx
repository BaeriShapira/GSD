import NextActionsBoard from "../components/next_actions/NextActionsBoard";

export default function NextActions() {
    return (
        <section className="p-2">
            <div className="px-4">
                <h1>Next Actions</h1>
                <p>Your actionable next steps across all projects.</p>
            </div>
            <NextActionsBoard />
        </section>
    );
}
