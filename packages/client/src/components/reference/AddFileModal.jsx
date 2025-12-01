import { useState, useEffect } from "react";
import Modal from "../UI/Modal";
import TagInput from "../UI/TagInput";
import AreaOfLifeSelector from "../UI/AreaOfLifeSelector";
import { useProjects } from "../../hooks/useProjects";
import { Upload, X } from "lucide-react";

export default function AddFileModal({
    isOpen,
    onClose,
    onSubmit,
    folderName,
    defaultProjectId = null,
    defaultAreaOfLifeId = null
}) {
    const [text, setText] = useState("");
    const [labels, setLabels] = useState([]);
    const [areaOfLifeId, setAreaOfLifeId] = useState(defaultAreaOfLifeId);
    const [projectId, setProjectId] = useState(defaultProjectId);
    const [files, setFiles] = useState([]);
    const { projects, isLoading: projectsLoading } = useProjects();

    // Update defaults when modal opens with new values
    useEffect(() => {
        if (isOpen) {
            setProjectId(defaultProjectId);
            setAreaOfLifeId(defaultAreaOfLifeId);
        }
    }, [isOpen, defaultProjectId, defaultAreaOfLifeId]);

    function handleFileChange(e) {
        const selected = Array.from(e.target.files || []);
        setFiles(prev => [...prev, ...selected]);
    }

    function removeFile(fileToRemove) {
        setFiles(prev => prev.filter(f => f !== fileToRemove));
    }

    // Filter projects by selected area
    const filteredProjects = areaOfLifeId
        ? projects.filter(p => p.areaOfLifeId === areaOfLifeId)
        : projects;

    function handleSubmit(e) {
        e.preventDefault();
        if (text.trim() || files.length > 0) {
            onSubmit({
                text: text.trim(),
                labels: labels.join(", "),
                areaOfLifeId,
                projectId,
                files
            });
            setText("");
            setLabels([]);
            setFiles([]);
            setAreaOfLifeId(defaultAreaOfLifeId);
            setProjectId(defaultProjectId);
            onClose();
        }
    }

    function handleCancel() {
        setText("");
        setLabels([]);
        setFiles([]);
        setAreaOfLifeId(defaultAreaOfLifeId);
        setProjectId(defaultProjectId);
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleCancel} title={`Add file to ${folderName}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-black/60 mb-1">
                        Text
                    </label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter file content..."
                        className="input min-h-[100px] resize-y"
                        autoFocus
                        rows={4}
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-black/60 mb-1">
                        Labels
                    </label>
                    <TagInput
                        tags={labels}
                        onChange={setLabels}
                        placeholder="Type and press enter..."
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-xs font-medium text-black/60 mb-1">
                        Attachments (optional)
                    </label>
                    <label className="btn btn-secondary cursor-pointer inline-flex items-center gap-2">
                        <Upload size={16} />
                        <span>Upload files</span>
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>

                    {/* Display selected files */}
                    {files.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {files.map(file => (
                                <span
                                    key={file.name + file.lastModified}
                                    className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 bg-black/5 text-xs"
                                >
                                    <span className="max-w-[200px] truncate">{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(file)}
                                        className="hover:text-red-600 transition-colors cursor-pointer"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <AreaOfLifeSelector
                    value={areaOfLifeId}
                    onChange={setAreaOfLifeId}
                />

                {/* Parent Project */}
                <div>
                    <label className="block text-xs font-medium text-black/60 mb-1">
                        Parent Project (optional)
                    </label>
                    <select
                        value={projectId || ""}
                        onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : null)}
                        className="input"
                        disabled={projectsLoading}
                    >
                        <option value="">No parent project</option>
                        {filteredProjects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                    {!areaOfLifeId && projects.length > 0 && (
                        <p className="text-xs text-black/40 mt-1">
                            Select an area to filter projects
                        </p>
                    )}
                </div>

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
                        disabled={!text.trim() && files.length === 0}
                    >
                        Add
                    </button>
                </div>
            </form>
        </Modal>
    );
}
