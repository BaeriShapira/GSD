import { useState, useEffect } from "react";
import Modal from "../UI/Modal";
import AreaOfLifeSelector from "../UI/AreaOfLifeSelector";

export default function NewProjectModal({ isOpen, onClose, onSubmit, initialProject = null }) {
    const [projectName, setProjectName] = useState("");
    const [outcome, setOutcome] = useState("");
    const [selectedAreaId, setSelectedAreaId] = useState(null);

    // Populate fields when editing
    useEffect(() => {
        if (initialProject) {
            setProjectName(initialProject.name || "");
            setOutcome(initialProject.outcome || "");
            setSelectedAreaId(initialProject.areaOfLifeId || null);
        } else {
            setProjectName("");
            setOutcome("");
            setSelectedAreaId(null);
        }
    }, [initialProject, isOpen]);

    function handleSubmit(e) {
        e.preventDefault();
        if (projectName.trim()) {
            onSubmit({
                name: projectName.trim(),
                outcome: outcome.trim() || null,
                areaOfLifeId: selectedAreaId
            });
            setProjectName("");
            setOutcome("");
            setSelectedAreaId(null);
            onClose();
        }
    }

    function handleCancel() {
        setProjectName("");
        setOutcome("");
        setSelectedAreaId(null);
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title={initialProject ? "Edit project" : "New project"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project name
                    </label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Untitled project"
                        className="input"
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ideal outcome (optional)
                    </label>
                    <textarea
                        value={outcome}
                        onChange={(e) => setOutcome(e.target.value)}
                        placeholder="What does success look like for this project?"
                        className="input min-h-[80px] resize-y"
                        rows={3}
                    />
                </div>

                <AreaOfLifeSelector
                    value={selectedAreaId}
                    onChange={setSelectedAreaId}
                />

                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!projectName.trim()}
                    >
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
}
