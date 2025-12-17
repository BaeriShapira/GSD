import Modal from "../UI/Modal";

export default function ArchiveTutorial({ isOpen, onClose, onComplete }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Archive">
            <div className="space-y-4">
                <p className="text-black/80">
                    The Archive stores all your completed tasks. Here you can:
                </p>

                <ul className="space-y-2 text-sm text-black/70">
                    <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Review past accomplishments</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Filter by project, area, context, or date range</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Restore tasks back to Next Actions</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Permanently delete tasks you no longer need</span>
                    </li>
                </ul>

                <div className="pt-4 flex justify-end">
                    <button onClick={onComplete} className="btn btn-primary">
                        Got it
                    </button>
                </div>
            </div>
        </Modal>
    );
}
